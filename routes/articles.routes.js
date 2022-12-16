const {
  getArticles,
  getArticleById,
  patchArticleVotes,
  getCommentsByArticleId,
  postComment,
} = require("../controllers/controllers.articles");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);
module.exports = articlesRouter;
