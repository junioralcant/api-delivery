const Produto = require("../models/Produto");
const User = require("../models/User");

class ProdutoController {
  async index(req, res) {
    const produtos = await Produto.paginate(null, {
      page: req.query.page || 1,
      limit: 10,
      populate: ["categoria"],
      sort: "-createdAt"
    });

    return res.json(produtos);
  }

  async store(req, res) {
    const userLogado = await User.findById(req.userId);

    if (userLogado.provedor !== true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para cadadastrar produtos"
      });
    }
    const produto = await Produto.create(req.body);

    return res.json(produto);
  }

  async show(req, res) {
    const produto = await Produto.findById(req.params.id);
    return res.json(produto);
  }

  async update(req, res) {
    const userLogado = await User.findById(req.userId);

    if (userLogado.provedor !== true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para alterar produtos"
      });
    }
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    return res.json(produto);
  }

  async destroy(req, res) {
    const userLogado = await User.findById(req.userId);

    if (userLogado.provedor !== true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para deletar produtos"
      });
    }
    await Produto.findByIdAndDelete(req.params.id);

    return res.send();
  }
}

module.exports = new ProdutoController();
