const db = require("../db/connection");

exports.checkIfItemExists = (category, elementToCheck) => {
  let query = `SELECT * FROM `;
  if (category === "topic") query += `topics WHERE slug = $1;`;
  else if (category === "article_id")
    query += `articles WHERE article_id = $1;`;

  return db.query(query, [elementToCheck]).then((data) => {
    if (data.rowCount === 0)
      return Promise.reject({ status: 404, msg: "Not found!" });
    else return true;
  });
};
