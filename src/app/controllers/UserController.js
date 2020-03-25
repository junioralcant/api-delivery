const { object } = require("yup");
const { string } = require("yup");
const { ref } = require("yup");

const User = require("../models/User");

class UserController {
  async index(req, res) {
    const user = await User.findById(req.userId);
    if (user.provedor !== true) {
      return res.status(400).json({
        mensagem: "Você não tem permissão para ver usuários do sistema"
      });
    }
    const users = await User.paginate(null, {
      page: req.query.page || 1,
      limit: 10,
      sort: "-createdAt"
    });

    return res.json(users);
  }

  async store(req, res) {
    const UserExists = await User.findOne({ email: req.body.email }); // verifica se o email informado já existe no bd

    if (UserExists) {
      return res
        .status(400)
        .json({ error: "Endereço de e-mail já existente." });
    }
    const user = await User.create(req.body); //retorna só os dados informados, poderia retornar todos os dados do bd atribuindo eles a uma variável

    return res.json(user);
  }

  async show(req, res) {
    const user = await User.findById(req.params.id);

    return res.json(user);
  }

  async update(req, res) {
    //validação
    const schema = object().shape({
      name: string(),
      email: string().email(),
      oldPassword: string().min(6),
      password: string()
        .min(6)
        .when("oldPassword", (oldPassword, field) => {
          // condicional para saber se oldPassword foi preenchida
          oldPassword ? field.required() : field;
        }),
      confirmPassword: string().when("password", (password, field) =>
        // ferifica se o campo de confirmação de senha corresponde
        password ? field.required().oneOf([ref("password")]) : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validação falhou" });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findById(req.userId); // busca o usuário pela PK

    if (email != user.email) {
      const userExists = await User.findOne({ where: { email } }); // verifica se o email informado já existe no bd

      if (userExists) {
        return res
          .status(400)
          .json({ error: "Endereço de e-mail não encontrado." });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({
        error: "A senha informada não corresponde com a antiga senha"
      });
    }
    await user.update(req.body, { new: true });

    return res.json(user);
  }

  async destroy(req, res) {
    await User.findOneAndDelete(req.params.id);

    return res.json();
  }
}

module.exports = new UserController();
