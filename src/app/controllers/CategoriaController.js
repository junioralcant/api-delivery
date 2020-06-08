const Categoria = require("../models/Categoria");
const Produto = require("../models/Produto");
const User = require("../models/User");

class CategoriaController {
  async index(req, res) {
    const categoria = await Categoria.paginate(null, {
      sort: { nome: "asc" },
    });

    return res.json(categoria);
  }

  async store(req, res) {
    const userLogado = await User.findById(req.userId);

    if (userLogado.provedor != true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para cria categorias",
      });
    }
    const categoria = await Categoria.create(req.body);

    return res.json(categoria);
  }

  async update(req, res) {
    const userLogado = await User.findById(req.userId);

    if (userLogado.provedor != true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para atualizar categorias",
      });
    }
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json(categoria);
  }

  async show(req, res) {
    const userLogado = await User.findById(req.userId);

    if (userLogado.provedor != true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para ver as categorias",
      });
    }
    const categoria = await Categoria.findById(req.params.id);

    return res.json(categoria);
  }

  async destroy(req, resp) {
    const userLogado = await User.findById(req.userId);

    if (userLogado.provedor != true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para deletar categorias",
      });
    }

    await Produto.remove({ categoria: req.params.id });

    await Categoria.findByIdAndDelete(req.params.id);

    return resp.send();
  }
}

module.exports = new CategoriaController();
