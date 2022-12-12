const error404Handler = (request, response, next) => {
  response.status(404).send({ msg: "Not found!" });
};

const error400Handler = (error, request, response, next) => {
  if (error.msg && error.status) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
};

const error500Handler = (error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Server error!" });
};

module.exports = {
  error404Handler,
  error400Handler,
  error500Handler,
};
