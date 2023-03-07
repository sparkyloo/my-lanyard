"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Lanyard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Card, Tagging, Tag }) {
      Lanyard.User = Lanyard.belongsTo(User, {
        as: "author",
        foreignKey: {
          name: "authorId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      Lanyard.Card = Lanyard.hasMany(Card, {
        as: "cards",
        foreignKey: {
          name: "lanyardId",
          onDelete: "CASCADE",
        },
      });

      Lanyard.Tagging = Lanyard.hasMany(Tagging, {
        as: "taggings",
        foreignKey: {
          name: "lanyardId",
          onDelete: "CASCADE",
        },
      });
    }
  }
  Lanyard.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Lanyard",
      tableName: "lanyards",
    }
  );
  return Lanyard;
};
