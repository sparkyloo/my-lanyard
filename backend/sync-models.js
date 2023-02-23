const { sequelize } = require("./db/models");

sequelize
  .sync({})
  .then(() => {
    console.log(`All models sync'd`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
