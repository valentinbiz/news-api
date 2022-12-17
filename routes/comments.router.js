const {
  deleteComment,
  patchComment,
} = require("../controllers/controller.comments");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").patch(patchComment).delete(deleteComment);

module.exports = commentsRouter;
