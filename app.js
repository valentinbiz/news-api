const express = require("express");
const {
  getArticles,
  getArticleById,
} = require("./controllers/controllers.articles");
const { getTopics } = require("./controllers/controllers.topics");
const {
  error404Handler,
  error400Handler,
  error500Handler,
} = require("./controllers/controllers.errors");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", error404Handler);
app.use(error400Handler);
app.use(error500Handler);

module.exports = app;
