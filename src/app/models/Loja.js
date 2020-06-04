const mongoose = require("mongoose");
const mongoosePagiante = require("mongoose-paginate");

const LojaSchema = new mongoose.Schema({
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

LojaSchema.plugin(mongoosePagiante);
module.exports = mongoose.model("Loja", LojaSchema);
