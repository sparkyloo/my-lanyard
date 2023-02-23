"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Lanyard, Icon, Firstthen }) {
      Card.belongsTo(User, {
        foreignKey: "author_id",
      });

      Card.belongsTo(Lanyard, {
        foreignKey: "lanyard_id",
      });

      Card.belongsTo(Icon, {
        foreignKey: "icon_id",
      });

      Card.hasOne(Firstthen, {
        foreignKey: "first",
      });

      Card.hasOne(Firstthen, {
        foreignKey: "then",
      });
    }
  }
  Card.init(
    {
      text: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Card",
      tableName: "cards",
    }
  );
  return Card;
};
