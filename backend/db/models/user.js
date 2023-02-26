"use strict";

const bcrypt = require("bcryptjs");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, firstName, lastName, email } = this; // context will be the User instance
      return { id, firstName, lastName, email };
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.passwordHash.toString());
    }

    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }

    static async login({ credential, password }) {
      const user = await User.scope("loginUser").findOne({
        where: {
          email: credential,
        },
      });

      if (user && user.validatePassword(password)) {
        return await User.scope("currentUser").findByPk(user.id);
      }
    }

    static async signup({ firstName, lastName, username, email, password }) {
      const passwordHash = bcrypt.hashSync(password);
      const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        passwordHash,
      });

      return await User.scope("currentUser").findByPk(user.id);
    }

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Lanyard, Card, Tag, Icon, Tagging }) {
      User.Lanyard = User.hasMany(Lanyard, {
        foreignKey: {
          name: "authorId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      User.Card = User.hasMany(Card, {
        foreignKey: {
          name: "authorId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      User.Icon = User.hasMany(Icon, {
        foreignKey: {
          name: "authorId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      User.Tag = User.hasMany(Tag, {
        foreignKey: {
          name: "authorId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });

      User.Tagging = User.hasMany(Tagging, {
        foreignKey: {
          name: "authorId",
          allowNull: false,
          onDelete: "CASCADE",
        },
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      defaultScope: {
        attributes: {
          exclude: ["passwordHash", "email", "createdAt", "updatedAt"],
        },
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ["passwordHash"] },
        },
        loginUser: {
          attributes: {},
        },
      },
    }
  );
  return User;
};
