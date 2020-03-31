const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  endereco: [
    {
      rua: {
        type: String,
        required: true
      },
      bairro: {
        type: String,
        required: true
      },
      cidade: {
        type: String,
        required: true,
        default: "São Mateus"
      },
      estado: {
        type: String,
        required: true,
        default: "MA"
      },
      numeroCasa: {
        type: String,
        required: true
      }
    }
  ],
  telefone: {
    type: String,
    required: true
  },
  provedor: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre("save", async function(next) {
  // criptografa a senha antes de salvar no bd
  if (!this.isModified("password")) {
    // se pass não foi modificado
    return next();
  }

  this.password = await bcrypt.hash(this.password, 4);
});

// cria um method comparar a senha informada pelo usuario com a senha cryptografada do bd
UserSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  }
};

// methods staticus
UserSchema.statics = {
  //craia um token para o usuário
  generateToken({ id }) {
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.ttl // um período para que esse token inspire
    });
  }
};
UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", UserSchema);
