const { selectUsers } = require("../models/models.users");

const getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((error) => next(error));
};

module.exports = { getUsers };
