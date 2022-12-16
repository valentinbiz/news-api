const { deleteCommentById } = require("../models/models.comments");
const { checkIfItemExists } = require("../models/models.validate");

const deleteComment = (request, response, next) => {
  const comment_id = request.params.comment_id;
  const promises = [deleteCommentById(comment_id)];
  promises.push(checkIfItemExists("comment_id", comment_id));
  Promise.all(promises)
    .then((deletedItem) => {
      response.status(204).send({ deletedItem });
    })
    .catch((error) => next(error));
};

module.exports = { deleteComment };
