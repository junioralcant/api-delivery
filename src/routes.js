const express = require("express");

const routes = express.Router();

const controllers = require("./app/controllers/");
const middleware = require("./app/middleware/auth");

/**
 * Session
 */
routes.post("/sessions", controllers.SessionController.store);
routes.post("/users", controllers.UserController.store);

/**
 * Loja
 */
routes.get("/lojadisponivel", controllers.LojaController.index);

/**
 * Categoria
 */
routes.get("/categorias", controllers.CategoriaController.index);

/**
 * Produto
 */
routes.get("/produtos", controllers.ProdutoController.index);

routes.use(middleware);

/**
 * Categoria
 */
routes.post("/categorias", controllers.CategoriaController.store);
routes.get("/categorias/:id", controllers.CategoriaController.show);
routes.put("/categorias/:id", controllers.CategoriaController.update);
routes.delete("/categorias/:id", controllers.CategoriaController.destroy);

/**
 * Produto
 */
routes.get("/produtos", controllers.ProdutoController.index);
routes.post("/produtos", controllers.ProdutoController.store);
routes.get("/produtos/:id", controllers.ProdutoController.show);
routes.put("/produtos/:id", controllers.ProdutoController.update);
routes.delete("/produtos/:id", controllers.ProdutoController.destroy);

/**
 * User
 */
routes.get("/users", controllers.UserController.index);
routes.get("/users/:id", controllers.UserController.show);
routes.put("/users/:id", controllers.UserController.update);
routes.delete("/users/:id", controllers.UserController.destroy);

/**
 * Loja
 */
routes.post("/lojadisponivel", controllers.LojaController.store);
routes.put("/lojadisponivel/:id", controllers.LojaController.update);
routes.get("/lojadisponivel/:id", controllers.LojaController.show);

/**
 * Pedido
 */
routes.get("/pedidos", controllers.PedidoController.index);
routes.post("/pedidos", controllers.PedidoController.store);
routes.get("/pedidos/:id", controllers.PedidoController.show);
routes.put("/pedidos/:id", controllers.PedidoController.update);
routes.delete("/pedidos/:id", controllers.PedidoController.destroy);

/**
 * Pedido Entregue
 */
routes.get("/pedidosentregues", controllers.PedidoEntregueController.index);

/**
 * Pedido Nao Entregue
 */
routes.get(
  "/pedidosnaoentregues",
  controllers.PedidoNaoEntregueController.index
);
routes.put(
  "/pedidosnaoentregues/:id",
  controllers.PedidoNaoEntregueController.update
);

/**
 * Endereço
 */

routes.post("/enderecos", controllers.EnderecoController.store);
routes.get("/enderecos/:id", controllers.EnderecoController.show);
routes.get("/enderecos", controllers.EnderecoController.index);
routes.delete("/enderecos/:id", controllers.EnderecoController.destroy);
module.exports = routes;
