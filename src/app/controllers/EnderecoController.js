const User = require("../models/User");
class EnderecoController {
  async index(req, res) {
    const user = await User.findById(req.userId);
    const { endereco } = user;

    // busca os endereços
    const enderecos = endereco.map(end => {
      return end;
    });

    return res.json(enderecos);
  }

  async store(req, res) {
    const user = await User.findById(req.userId);
    const { endereco } = req.body;

    user.endereco.push(endereco);
    await user.save();

    const enderecos = user.endereco.map(end => {
      return end;
    });

    return res.json(enderecos);
  }

  async show(req, res) {
    const user = await User.findById(req.userId);
    const { endereco } = user;

    const { id } = req.params;
    const [, idFormatado] = id.split(" "); // tira o espaço que vem por padrão no início do id

    //busca um endereço especifico
    const enderecoEspecifico = endereco.find(
      end => String(end._id) === String(idFormatado)
    );

    return res.json(enderecoEspecifico);
  }

  async destroy(req, res) {
    const user = await User.findById(req.userId);
    const { endereco } = user;

    const { id } = req.params;

    // Remove do array um endereço específico
    user.endereco = endereco.filter(filtroId => {
      if (String(filtroId._id) === String(id)) {
        return false; // se retornar false, remove o endereço
      }
      return true; // se retornar treu,  retorna tudo normalmante
    });

    await user.save();

    return res.json();
  }
}

module.exports = new EnderecoController();
