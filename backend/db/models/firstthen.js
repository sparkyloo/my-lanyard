"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Firstthen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Card }) {
      Firstthen.belongsTo(User, {
        foreignKey: "author_id",
      });

      Firstthen.belongsTo(Card, {
        foreignKey: "first",
      });

      Firstthen.belongsTo(Card, {
        foreignKey: "then",
      });
    }
  }
  Firstthen.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Firstthen",
      tableName: "firstthens",
    }
  );
  return Firstthen;
};
