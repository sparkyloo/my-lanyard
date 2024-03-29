const config = require("./index");

module.exports = {
  // development: {
  //   storage: config.dbFile,
  //   dialect: "sqlite",
  //   seederStorage: "sequelize",
  //   logQueryParameters: true,
  //   typeValidation: true
  // },
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    seederStorage: "sequelize",
    schema: process.env.SCHEMA,
    searchPath: process.env.SCHEMA,
    define: {
      schema: process.env.SCHEMA,
    },
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false,
      // },
      prependSearchPath: true,
    },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    seederStorage: "sequelize",
    schema: process.env.SCHEMA,
    searchPath: process.env.SCHEMA,
    define: {
      schema: process.env.SCHEMA,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      prependSearchPath: true,
    },
  },
};
