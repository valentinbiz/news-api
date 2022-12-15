const {
  selectArticles,
  selectArticleById,
  updateVotes,
} = require("../models/models.articles");
const {
  selectCommentsByArticleId,
  insertComment,
} = require("../models/models.comments");
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
    .then(([comments]) => response.status(200).send({ comments }))
    .catch((error) => next(error));
};

const postComment = (request, response, next) => {
  const { body, username } = request.body;
  const articleId = request.params.article_id;
  insertComment(articleId, body, username)
    .then((comment) => response.status(201).send({ comment }))
    .catch((error) => next(error));
};

const patchArticleVotes = (request, response, next) => {
  const { inc_votes } = request.body;
  const articleId = request.params.article_id;
  updateVotes(articleId, inc_votes)
    .then(({ rows }) => response.status(200).send({ article: rows[0] }))
    .catch((error) => next(error));
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticleVotes,
  postComment,
};
