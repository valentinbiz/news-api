const db = require("../db/connection");

exports.checkIfIdExists = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rowCount }) => {
      if (rowCount === 0)
        return Promise.reject({ status: 404, msg: "Not found!" });
      else return true;
    });
};
