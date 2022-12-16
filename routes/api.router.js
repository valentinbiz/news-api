const apiRouter = require("express").Router();
const { getInfo } = require("../controllers/controller.api");
const articlesRouter = require("./articles.routes");
const commentsRouter = require("./comments.router");
const topicRouter = require("./topics.router");
const userRouter = require("./users.router");

apiRouter.get("/", getInfo);
apiRouter.use("/users", userRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
