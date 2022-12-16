const { selectUsers, selectUserByUsername } = require("../models/models.users");
const { checkIfItemExists } = require("../models/models.validate");

const getUsers = (request, response, next) => {
  selectUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
};

const getUserByUsername = (request, response, next) => {
  const username = request.params.username;
  const promises = [selectUserByUsername(username)];
  promises.push(checkIfItemExists("username", username));
  Promise.all(promises)
    .then(([user]) => {
      response.status(200).send({ user: user[0] });
    })
    .catch(next);
};

module.exports = { getUsers, getUserByUsername };
