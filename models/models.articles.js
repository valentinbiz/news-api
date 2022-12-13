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

module.exports = { selectArticles };
