const Produto = require("../models/Produto");
const User = require("../models/User");

class ProdutoController {
  async index(req, res) {
    const filters = {};

    if (req.query.nome) {
      filters.nome = new RegExp(req.query.nome, "i");
    }

    const produtos = await Produto.paginate(filters, {
      page: req.query.page || 1,
      limit: 100,
      populate: ["categoria"],
      sort: { nome: "asc" },
    });

    return res.json(produtos);
  }

  async store(req, res) {
    const userLogado = await User.findById(req.userId);

    if (userLogado.provedor !== true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para cadadastrar produtos",
      });
    }
    const produto = await Produto.create(req.body);

    return res.json(produto);
  }

  async show(req, res) {
    const produto = await Produto.findById(req.params.id).populate("categoria");
    return res.json(produto);
  }

  async update(req, res) {
    const userLogado = await User.findById(req.userId);

    if (userLogado.provedor !== true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para alterar produtos",
      });
    }
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.json(produto);
  }

  async destroy(req, res) {
    const userLogado = await User.findById(req.userId);

    if (userLogado.provedor !== true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para deletar produtos",
      });
    }
    await Produto.findByIdAndDelete(req.params.id);

    return res.send();
  }
}

module.exports = new ProdutoController();
