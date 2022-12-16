const { getTopics } = require("../controllers/controllers.topics");

const topicRouter = require("express").Router();

topicRouter.get("/", getTopics);

module.exports = topicRouter;
