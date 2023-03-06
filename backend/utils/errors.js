module.exports = {
  notRecognized: () => ({
    statusCode: 401,
    message: "The user is not recognized",
  }),
  notFound: (name) => ({
    statusCode: 404,
    message: `${name} was not be found`,
  }),
};
