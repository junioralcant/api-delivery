const mongoose = require("mongoose");
const mongoosePagiante = require("mongoose-paginate");

const CategoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  disponivel: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CategoriaSchema.plugin(mongoosePagiante);
module.exports = mongoose.model("Categoria", CategoriaSchema);
