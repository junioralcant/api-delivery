const mongoose = require("mongoose");
const mongoosePagiante = require("mongoose-paginate");

const ProdutoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true
  },
  descricao: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ProdutoSchema.plugin(mongoosePagiante);
module.exports = mongoose.model("Produto", ProdutoSchema);
