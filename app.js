const express = require("express");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticleVotes,
} = require("./controllers/controllers.articles");
const { getTopics } = require("./controllers/controllers.topics");
const {
  error404Handler,
  error400Handler,
  error500Handler,
  errorPsqlHandler,
} = require("./controllers/controllers.errors");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("*", error404Handler);
app.use(error400Handler);
app.use(errorPsqlHandler);
app.use(error500Handler);

module.exports = app;
