"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Lanyard, Icon, Tagging, Tag }) {
      Card.User = Card.belongsTo(User, {
        as: "author",
        foreignKey: {
          name: "authorId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      Card.Icon = Card.belongsTo(Icon, {
        as: "icon",
        foreignKey: {
          name: "iconId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      Card.Lanyard = Card.belongsTo(Lanyard, {
        as: "lanyard",
        foreignKey: {
          name: "lanyardId",
          onDelete: "CASCADE",
        },
      });

      Card.Tagging = Card.hasMany(Tagging, {
        as: "taggings",
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
