const { sequelize } = require("./db/models");

sequelize
  .sync({ force: true })
  .then(() => {
    console.log(`All models sync'd`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
