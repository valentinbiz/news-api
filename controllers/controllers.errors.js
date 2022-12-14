const errorPsqlHandler = (error, request, response, next) => {
  if (error.code === "22P02") response.status(400).send({ msg: "Bad request" });
  else if (error.code === "23503")
    response.status(404).send({ msg: "Not found!" });
  else next(error);
};
const error400Handler = (error, request, response, next) => {
  if (error.msg && error.status) {
    response.status(error.status).send({ msg: error.msg });
  } else next(error);
};

const error404Handler = (request, response, next) => {
  response.status(404).send({ msg: "Not found!" });
};

const error500Handler = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Server error!" });
};

module.exports = {
  error404Handler,
  error400Handler,
  errorPsqlHandler,
  error500Handler,
};
