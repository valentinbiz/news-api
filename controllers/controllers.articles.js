const {
  selectArticles,
  selectArticleById,
} = require("../models/models.articles");

const getArticles = (request, response, next) => {
  selectArticles()
    .then((articles) => response.status(200).send({ articles }))
    .catch((error) => next(error));
};

const getArticleById = (request, response, next) => {
  const articleId = request.params.article_id;
  selectArticleById(articleId)
    .then((article) => response.status(200).send({ article }))
    .catch((error) => next(error));
};

module.exports = {
  getArticles,
  getArticleById,
};
