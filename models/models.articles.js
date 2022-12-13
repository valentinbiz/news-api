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

module.exports = { selectArticles, selectArticleById };
