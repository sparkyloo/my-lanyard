"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Icon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Card, Tagging }) {
      Icon.User = Icon.belongsTo(User, {
        foreignKey: {
          name: "authorId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      Icon.Card = Icon.hasMany(Card, {
        foreignKey: {
          name: "iconId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      Icon.Tagging = Icon.hasMany(Tagging, {
        foreignKey: {
          name: "iconId",
          onDelete: "CASCADE",
        },
      });
    }
  }
  Icon.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Icon",
      tableName: "icons",
    }
  );
  return Icon;
};
