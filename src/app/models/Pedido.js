const mongoose = require("mongoose");
const mongoosePagiante = require("mongoose-paginate");

const PedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  nomeCliente: {
    type: String,
    required: true
  },
  produto: [
    {
      produtoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Produto",
        required: true
      },
      quantidade: Number,
      valor: Number
    }
  ],

  entregue: {
    type: Boolean,
    default: false
  },
  valorTotal: {
    type: Number,
    required: false
  },
  enderecoEntrega: [{}],
  userOneSignalId: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

PedidoSchema.plugin(mongoosePagiante);
module.exports = mongoose.model("Pedido", PedidoSchema);
