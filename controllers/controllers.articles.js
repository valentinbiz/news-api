const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
} = require("../models/models.articles");
const { checkIfIdExists } = require("../models/models.id");

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

const getCommentsByArticleId = (request, response, next) => {
  const articleId = request.params.article_id;
  const promises = [selectCommentsByArticleId(articleId)];
  promises.push(checkIfIdExists(articleId));

  Promise.all(promises)
    .then(([comments]) => {
      response.status(200).send({ comments });
    })
    .catch((error) => next(error));
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
};
