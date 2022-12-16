const endpointsData = require("../endpoints.json");

const getInfo = (request, response, next) => {
  response.status(200).send(endpointsData);
};

module.exports = { getInfo };
