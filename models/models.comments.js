const db = require("../db/connection");

const selectCommentsByArticleId = (articleId) => {
  const queryString = `
    SELECT author, body, votes, comment_id, created_at 
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `;

  return db.query(queryString, [articleId]).then(({ rows }) => {
    return rows;
  });
};

const insertComment = (articleId, body, username) => {
  if (
    !body ||
    !username ||
    typeof body !== "string" ||
    typeof username !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  const queryString = `
  INSERT INTO comments
  (body, author, article_id)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  return db.query(queryString, [body, username, articleId]).then(({ rows }) => {
    return rows[0];
  });
};

const updateCommentVotes = (commentId, updateInfo) => {
  const updateCommentsVotesQueryString = `
  UPDATE comments 
  SET votes = $1 
  WHERE comment_id = $2 
  RETURNING *;
  `;

  const getCurrentVotesQueryString = `
  SELECT votes 
  FROM comments 
  WHERE comment_id = $1
  `;

  return db
    .query(getCurrentVotesQueryString, [commentId])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Not found!" });
      return rows[0];
    })
    .then(({ votes }) => {
      const newVotes = votes + updateInfo;
      return db.query(updateCommentsVotesQueryString, [newVotes, commentId]);
    });
};

const deleteCommentById = (commentId) => {
  const queryString = `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `;
  return db.query(queryString, [commentId]).then(({ rows }) => {
    return rows;
  });
};

module.exports = {
  selectCommentsByArticleId,
  insertComment,
  updateCommentVotes,
  deleteCommentById,
};
