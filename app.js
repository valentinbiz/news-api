const express = require("express");
const { getArticles } = require("./controllers/controllers.articles");
const { getTopics } = require("./controllers/controllers.topics");
const {
  error404Handler,
  error400Handler,
  error500Handler,
} = require("./controllers/controllers.errors");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.all("*", error404Handler);
app.use(error400Handler);
app.use(error500Handler);

module.exports = app;
