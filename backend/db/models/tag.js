"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Tagging, Card, Icon, Lanyard }) {
      Tag.User = Tag.belongsTo(User, {
        as: "author",
        foreignKey: {
          name: "authorId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      Tag.Tagging = Tag.hasMany(Tagging, {
        as: "taggings",
        foreignKey: {
          name: "tagId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });
    }
  }
  Tag.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Tag",
      tableName: "tags",
    }
  );
  return Tag;
};
