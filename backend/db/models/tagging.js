"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Tagging extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Card, Icon, Lanyard, Tag }) {
      Tagging.User = Tagging.belongsTo(User, {
        foreignKey: {
          name: "authorId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      Tagging.Tag = Tagging.belongsTo(Tag, {
        foreignKey: {
          name: "tagId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      Tagging.Card = Tagging.belongsTo(Card, {
        foreignKey: {
          name: "cardId",
          onDelete: "CASCADE",
        },
      });

      Tagging.Icon = Tagging.belongsTo(Icon, {
        foreignKey: {
          name: "iconId",
          onDelete: "CASCADE",
        },
      });

      Tagging.Lanyard = Tagging.belongsTo(Lanyard, {
        foreignKey: {
          name: "lanyardId",
          onDelete: "CASCADE",
        },
      });
    }
  }
  Tagging.init(
    {
      //
    },
    {
      sequelize,
      modelName: "Tagging",
      tableName: "taggings",
      hooks: {
        afterUpdate: (tagging) => {
          const { cardId, iconId, lanyardId } = tagging;

          // when the "tagging" no longer references anything it should be dropped
          if (!cardId && !iconId && !lanyardId) {
            tagging.destroy();
          }
        },
      },
      validate: {
        onlyReferencesOneObject() {
          const references = [this.cardId, this.iconId, this.lanyardId];

          if (references.filter(Boolean).length > 1) {
            throw new Error(
              "Tagging entries must reference exactly one object"
            );
          }
        },
      },
    }
  );
  return Tagging;
};
