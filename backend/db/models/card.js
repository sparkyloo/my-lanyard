"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Lanyard, Icon, Tagging }) {
      Card.User = Card.belongsTo(User, {
        foreignKey: {
          name: "authorId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      Card.Icon = Card.belongsTo(Icon, {
        foreignKey: {
          name: "iconId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      Card.Lanyard = Card.belongsTo(Lanyard, {
        foreignKey: {
          name: "lanyardId",
          onDelete: "CASCADE",
        },
      });

      Card.Tagging = Card.hasMany(Tagging, {
        foreignKey: {
          name: "cardId",
          onDelete: "CASCADE",
        },
      });
    }
  }
  Card.init(
    {
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Card",
      tableName: "cards",
    }
  );
  return Card;
};
