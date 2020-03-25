const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const { promisify } = require("util"); // para poder usar o async await onde não é retornado uma promise
module.exports = async (req, resp, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return resp.status(401).json({ error: "Token not provided" });
  }

  const [, token] = authHeader.split(" "); // junto com o token vem a palvra Bearer. esse esquema é para pegar a penas a variavel token que esta separado do token por um espaço em branco "Bearer Token" por isso o split

  // verifica se o token é valido ou não
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret); // tem acesso ao id do usuario

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return resp.status(401).json({ error: "Token invalid" });
  }
};
