const db = require("../db/connection");

const selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortByQueries = [
    "author",
    "created_at",
    "title",
    "article_id",
    "topic",
    "votes",
    "comment_count",
  ];
  const validSortingOrder = ["asc", "desc"];
  const validTopic = ["mitch", "cats", "coding", "football", "cooking"];

  if (topic !== undefined && !validTopic.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!validSortingOrder.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!validSortByQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let query = `
  SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id `;

  const queryParam = [];
  if (topic !== undefined) {
    query += `WHERE topic = $1`;
    queryParam.push(topic);
  }

  if (sort_by !== "created_at") order = "ASC";

  query += `
  GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order};`;
  return db.query(query, queryParam).then(({ rows }) => {
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
