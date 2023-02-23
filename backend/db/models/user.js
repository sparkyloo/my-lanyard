"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Lanyard, Card, Firstthen, Tag, Icon }) {
      User.hasMany(Lanyard, {
        foreignKey: "author_id",
      });

      User.hasMany(Card, {
        foreignKey: "author_id",
      });

      User.hasMany(Firstthen, {
        foreignKey: "author_id",
      });

      User.hasMany(Icon, {
        foreignKey: "author_id",
      });

      User.hasMany(Tag, {
        foreignKey: "author_id",
      });
    }
  }
  User.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password_hash: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
