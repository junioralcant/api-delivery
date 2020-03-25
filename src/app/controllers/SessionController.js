const User = require("../models/User");

class SessionController {
  async store(req, resp) {
    // responssável pelo login
    const { email, password } = req.body;

    const user = await User.findOne({ email }); // recebe o email existende no bd, que no caso é unico

    if (!user) {
      // se difenrente de user, ou seja, se ele não existir
      return resp.status(400).json({ error: "Usuario não encontrado" });
    }

    if (!(await user.compareHash(password))) {
      // se as senhas forem diferentes
      return resp.status(400).json({ error: "Senha inválida" });
    }

    return resp.json({ user, token: User.generateToken(user) });
  }
}

module.exports = new SessionController();
