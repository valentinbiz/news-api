const db = require("../db/connection");

const selectUsers = () => {
  const queryString = `
    SELECT * FROM users;
    `;

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

const selectUserByUsername = (username) => {
  const queryString = `
  SELECT * FROM users
  WHERE username = $1;
  `;

  return db.query(queryString, [username]).then(({ rows }) => {
    return rows;
  });
};

module.exports = { selectUsers, selectUserByUsername };
