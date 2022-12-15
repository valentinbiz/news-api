const { deleteCommentById } = require("../models/models.comments");

const deleteComment = (request, response, next) => {
  const comment_id = request.params.comment_id;

  deleteCommentById(comment_id)
    .then((deletedItem) => {
      response.status(204).send({ deletedItem });
    })
    .catch((error) => next(error));
};

module.exports = { deleteComment };
