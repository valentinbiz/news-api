const db = require("../db/connection");

const selectTopics = () => {
  const queryString = `SELECT * FROM topics;`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

module.exports = { selectTopics };
