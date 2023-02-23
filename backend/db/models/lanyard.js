"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lanyard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Card }) {
      Lanyard.belongsTo(User, {
        foreignKey: "author_id",
      });

      Lanyard.hasMany(Card, {
        foreignKey: "lanyard_id",
      });
    }
  }
  Lanyard.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Lanyard",
      tableName: "lanyards",
    }
  );
  return Lanyard;
};
