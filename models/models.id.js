const db = require("../db/connection");

exports.checkIfItemExists = (category, elementToCheck) => {
  let query = `SELECT * FROM articles `;
  if (category === "topic") query += `WHERE topic = $1;`;
  else if (category === "article_id") query += `WHERE article_id = $1;`;

  return db.query(query, [elementToCheck]).then((data) => {
    if (data.rowCount === 0)
      return Promise.reject({ status: 404, msg: "Not found!" });
    else return true;
  });
};
