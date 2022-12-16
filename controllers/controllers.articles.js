const {
  selectArticles,
  selectArticleById,
  updateVotes,
} = require("../models/models.articles");
const {
  selectCommentsByArticleId,
  insertComment,
} = require("../models/models.comments");
const { checkIfItemExists } = require("../models/models.validate");

const getArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query;
  const promises = [selectArticles(sort_by, order, topic)];
  if (topic !== undefined) promises.push(checkIfItemExists("topic", topic));
  Promise.all(promises)
    .then(([articles]) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (request, response, next) => {
  const articleId = request.params.article_id;
  selectArticleById(articleId)
    .then((article) => response.status(200).send({ article }))
    .catch(next);
};

const getCommentsByArticleId = (request, response, next) => {
  const articleId = request.params.article_id;
  const promises = [selectCommentsByArticleId(articleId)];
  promises.push(checkIfItemExists("article_id", articleId));
  Promise.all(promises)
    .then(([comments]) => response.status(200).send({ comments }))
    .catch(next);
};

const postComment = (request, response, next) => {
  const { body, username } = request.body;
  const articleId = request.params.article_id;
  insertComment(articleId, body, username)
    .then((comment) => response.status(201).send({ comment }))
    .catch(next);
};

const patchArticleVotes = (request, response, next) => {
  const { inc_votes } = request.body;
  const articleId = request.params.article_id;
  updateVotes(articleId, inc_votes)
    .then(({ rows }) => response.status(200).send({ article: rows[0] }))
    .catch(next);
};

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticleVotes,
  postComment,
};
