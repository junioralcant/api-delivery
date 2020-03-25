const Pedido = require("../models/Pedido");

const User = require("../models/User");

class PedidoNaoEntregueController {
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
      entregue: false,
      nomeCliente: new RegExp(req.query.nome, "i")
    }).populate(["cliente", "produto"]);

    return res.json(pedidos);
  }

  async update(req, res) {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    req.io.emit(`entreguePedido${req.userId}`, {
      message: "Seu pedido saiu para entrega"
    });

    return res.json(pedido);
  }
}

module.exports = new PedidoNaoEntregueController();
