"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Icon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Card }) {
      Icon.belongsTo(User, {
        foreignKey: "author_id",
      });

      Icon.hasMany(Card, {
        foreignKey: "icon_id",
      });
    }
  }
  Icon.init(
    {
      name: DataTypes.STRING,
      image_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Icon",
      tableName: "icons",
    }
  );
  return Icon;
};
