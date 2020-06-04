const Loja = require("../models/Loja");

class LojaController {
  async index(req, res) {
    const loja = await Loja.find();

    return res.json(loja);
  }

  async store(req, res) {
    const loja = await Loja.create(req.body);

    return res.json(loja);
  }

  async show(req, res) {
    const loja = await Loja.findById(req.params.id);

    return res.json(loja);
  }

  async update(req, res) {
    const loja = await Loja.findOneAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.json(loja);
  }
}

module.exports = new LojaController();
