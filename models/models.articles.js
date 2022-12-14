const db = require("../db/connection");

const selectArticles = () => {
  const query = `
  SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
  FROM articles
  
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;
  return db.query(query).then(({ rows }) => {
    return rows;
  });
};

const selectArticleById = (articleId) => {
  const queryString = `
  SELECT * FROM articles
  WHERE article_id = $1;
  `;
  return db.query(queryString, [articleId]).then(({ rows }) => {
    if (rows.length === 0)
      return Promise.reject({ status: 404, msg: "Not found!" });
    return rows[0];
  });
};

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

const updateVotes = (articleId, updateInfo) => {
  const updateVotesQueryString = `
  UPDATE articles 
  SET votes = $1 
  WHERE article_id = $2 
  RETURNING *;
  `;

  const getCurrentVotesQueryString = `
  SELECT votes 
  FROM articles 
  WHERE article_id = $1
  `;

  return db
    .query(getCurrentVotesQueryString, [articleId])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Not found!" });
      return rows[0];
    })
    .then(({ votes }) => {
      const newVotes = votes + updateInfo;
      return db.query(updateVotesQueryString, [newVotes, articleId]);
    });
};

module.exports = {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  updateVotes,
};
