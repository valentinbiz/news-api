const {
  deleteCommentById,
  updateCommentVotes,
} = require("../models/models.comments");
const { checkIfItemExists } = require("../models/models.validate");

const patchComment = (request, response, next) => {
  const commentId = request.params.comment_id;
  const inc_votes = request.body.inc_votes;
  updateCommentVotes(commentId, inc_votes)
    .then(({ rows }) => {
      response.status(200).send({ updatedComment: rows[0] });
    })
    .catch(next);
};

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

module.exports = { deleteComment, patchComment };
