const { formatToTimeZone } = require("date-fns-timezone");

const getHours = require("date-fns/getHours");

const Pedido = require("../models/Pedido");
const Produto = require("../models/Produto");

const User = require("../models/User");

class PedidoController {
  async index(req, res) {
    const filters = {};

    if (req.query.nome) {
      filters.nomeCliente = new RegExp(req.query.nome, "i");
    }

    if (req.query.data_min || req.query.data_max) {
      filters.createdAt = {};

      const dataMinFormatada = formatToTimeZone(
        req.query.data_min,
        "YYYY-MM-DDT00:mm:ss.SSSZ", // formatação de data e hora
        {
          timeZone: "America/Sao_Paulo",
        }
      );

      const dataMaxFormatada = formatToTimeZone(
        req.query.data_max,
        "YYYY-MM-DDT23:59:ss.SSSZ", // formatação de data e hora
        {
          timeZone: "America/Sao_Paulo",
        }
      );

      filters.createdAt.$gte = dataMinFormatada;
      filters.createdAt.$lte = dataMaxFormatada;
    }

    const userLogado = await User.findById(req.userId);

    // se não for um provedor
    if (userLogado.provedor !== true) {
      const pedidos = await Pedido.find({
        cliente: req.userId,
      })
        .populate(["cliente", "produto.produtoId"])
        .sort("-createdAt");

      return res.json(pedidos);
    }

    const pedidos = await Pedido.paginate(filters, {
      page: req.query.page || 1,
      limit: parseInt(req.query.limit_page) || 12,
      populate: ["cliente", "produto.produtoId"],
      sort: "-createdAt",
    });

    return res.json(pedidos);
  }

  async store(req, res) {
    const { enderecoId, produtos, trocoPara } = req.body;

    const user = await User.findById(req.userId);

    const { endereco } = user;

    const enderecoEspecifico = endereco.find(
      (end) => String(end._id) === String(enderecoId)
    );

    const pedido = await Pedido.create({
      enderecoEntrega: enderecoEspecifico,
      cliente: req.userId,
      nomeCliente: user.nome,
      trocoPara,
    });

    await Promise.all(
      produtos.map(async (produto) => {
        const produtoAll = await Produto.findById(produto.produtoId);

        const valor = produtoAll.preco * produto.quantidade;

        pedido.produto.push({ ...produto, valor });
      })
    );

    const valorTotal = pedido.produto.reduce(
      (valorTotal, valor) => valorTotal + valor.valor,
      0
    );

    pedido.valorTotal = valorTotal;

    await pedido.save();

    req.io.emit("createPedido", {
      message: "Um novo pedido foi realizado",
    });

    return res.json(pedido);
  }

  async update(req, res) {
    const userLogado = await User.findById(req.userId);
    const produto = await Produto.findById(req.body.produto);
    const pedidoExistente = await Pedido.findById(req.params.id);

    // validação para ver se o usuário logado fez o pedido ou é um provedor
    if (
      String(userLogado._id) !== String(pedidoExistente.cliente) &&
      userLogado.provedor !== true
    ) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para alterar este pedido.",
      });
    }

    const valorQuantidadeUpdate =
      pedidoExistente.quantidade - req.body.quantidade;

    // Condição para alterar a quantidade do produto em estoque com base na alteração da quantidade do pedido
    if (valorQuantidadeUpdate < 0) {
      const quantidade = valorQuantidadeUpdate * -1; // formata para um número positivo
      produto.quantidade -= quantidade;
    } else {
      const quantidade = valorQuantidadeUpdate;
      produto.quantidade += quantidade;
    }

    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, {
      valorTotal: produto.preco * req.body.quantidade,
      new: true,
    });

    pedido.valorTotal = produto.preco * req.body.quantidade;

    await produto.save(); // atualiza as alterações feitas no produto
    await pedido.save(); // atualiza as alterações feitas no pedido

    return res.json(pedido);
  }

  async show(req, res) {
    const userLogado = await User.findById(req.userId);
    const pedidoExistente = await Pedido.findById(req.params.id);

    const pedido = await Pedido.findById(req.params.id)
      .populate("produto.produtoId")
      .populate("cliente");

    return res.json(pedido);
  }

  async destroy(req, res) {
    const userLogado = await User.findById(req.userId);

    //permite que apenas o provedor delete pedidos
    if (userLogado.provedor !== true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para excluir este pedido.",
      });
    }

    await Pedido.findByIdAndDelete(req.params.id);

    return res.json();
  }
}

module.exports = new PedidoController();
