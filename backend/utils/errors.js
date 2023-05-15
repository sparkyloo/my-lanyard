module.exports = {
  notAllowed: () => ({
    statusCode: 403,
    message: "The user does not have access",
  }),
  notRecognized: () => ({
    statusCode: 401,
    message: "The user is not recognized",
  }),
  notFound: (name) => ({
    statusCode: 404,
    message: `${name} was not be found`,
  }),
  conflict: (email) => ({
    statusCode: 409,
    message: `${email} already in use.`,
  }),
};
