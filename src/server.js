require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const routes = require("./routes");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  console.log("Nova Conexão", socket.id);
});

const databaseConfig = require("./config/database");

isDev = process.env.NODE_ENV != "development";

mongoose.connect(databaseConfig.uri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(express.json());
app.use(cors());
app.use(routes);

server.listen(process.env.PORT || 3001);
