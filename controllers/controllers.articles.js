const { selectArticles } = require("../models/models.articles");

const getArticles = (request, response, next) => {
  selectArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getArticles,
};
