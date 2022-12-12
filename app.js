const express = require("express");
const {
  error404Handler,
  error400Handler,
  error500Handler,
} = require("./controllers/controllers.errors");
const { getTopics } = require("./controllers/controllers.topics");

const app = express();

app.get("/api/topics", getTopics);

app.all("*", error404Handler);
app.use(error400Handler);
app.use(error500Handler);

module.exports = app;
