const Pedido = require("../models/Pedido");

const User = require("../models/User");

class PedidoEntregueController {
  async index(req, res) {
    const userLogado = await User.findById(req.userId);

    // se não for um provedor
    if (userLogado.provedor !== true) {
      const pedidos = await Pedido.find({
        cliente: req.userId
      }).populate(["cliente", "produto"]);

      return res.json(pedidos);
    }

    const pedidos = await Pedido.find({
      entregue: true,
      nomeCliente: new RegExp(req.query.name, "i")
    }).populate(["cliente", "produto"]);

    return res.json(pedidos);
  }
}

module.exports = new PedidoEntregueController();
