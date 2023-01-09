const express = require("express");
const cors = require("cors");

const {
  error404Handler,
  error400Handler,
  error500Handler,
  errorPsqlHandler,
} = require("./controllers/controllers.errors");

const apiRouter = require("./routes/api.router");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", error404Handler);
app.use(error400Handler);
app.use(errorPsqlHandler);
app.use(error500Handler);

module.exports = app;
