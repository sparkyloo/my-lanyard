"use strict";

const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcryptjs");
const { User, Icon, Tag, Tagging } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const admin = await User.create({
      id: 1,
      firstName: "System",
      lastName: "Admin",
      email: "system.admin@mylanyard.org",
      passwordHash: bcrypt.hashSync("password"),
    });

    const colorIconImages = await fs.readdir(
      path.join(__dirname, "../../../frontend/public/system-images/colors")
    );

    const colorTag = await Tag.create({
      authorId: admin.id,
      name: "color",
    });

    const colorIcons = await Icon.bulkCreate(
      colorIconImages.map((filename) => {
        return {
          authorId: admin.id,
          name: getIconName(filename),
          imageUrl: `/system-images/colors/${filename}`,
        };
      }),
      {
        validate: true,
      }
    );

    await Tagging.bulkCreate(
      colorIcons.map((colorIcon) => {
        return {
          authorId: admin.id,
          tagId: colorTag.id,
          iconId: colorIcon.id,
        };
      }),
      {
        validate: true,
      }
    );

    const emotionIconImages = await fs.readdir(
      path.join(__dirname, "../../../frontend/public/system-images/emotions")
    );

    const emotionTag = await Tag.create({
      authorId: admin.id,
      name: "emotion",
    });

    const emotionIcons = await Icon.bulkCreate(
      emotionIconImages.map((filename) => {
        return {
          authorId: admin.id,
          name: getIconName(filename),
          imageUrl: `/system-images/emotions/${filename}`,
        };
      }),
      {
        validate: true,
      }
    );

    await Tagging.bulkCreate(
      emotionIcons.map((emotionIcon) => {
        return {
          authorId: admin.id,
          tagId: emotionTag.id,
          iconId: emotionIcon.id,
        };
      }),
      {
        validate: true,
      }
    );

    const foodIconImages = await fs.readdir(
      path.join(__dirname, "../../../frontend/public/system-images/foods")
    );

    const foodTag = await Tag.create({
      authorId: admin.id,
      name: "food",
    });

    const foodIcons = await Icon.bulkCreate(
      foodIconImages.map((filename) => {
        return {
          authorId: admin.id,
          name: getIconName(filename),
          imageUrl: `/system-images/foods/${filename}`,
        };
      }),
      {
        validate: true,
      }
    );

    await Tagging.bulkCreate(
      foodIcons.map((foodIcon) => {
        return {
          authorId: admin.id,
          tagId: foodTag.id,
          iconId: foodIcon.id,
        };
      }),
      {
        validate: true,
      }
    );

    const otherIconImages = await fs.readdir(
      path.join(__dirname, "../../../frontend/public/system-images/other")
    );

    const otherTag = await Tag.create({
      authorId: admin.id,
      name: "other",
    });

    const otherIcons = await Icon.bulkCreate(
      otherIconImages.map((filename) => {
        return {
          authorId: admin.id,
          name: getIconName(filename),
          imageUrl: `/system-images/other/${filename}`,
        };
      }),
      {
        validate: true,
      }
    );

    await Tagging.bulkCreate(
      otherIcons.map((otherIcon) => {
        return {
          authorId: admin.id,
          tagId: otherTag.id,
          iconId: otherIcon.id,
        };
      }),
      {
        validate: true,
      }
    );
  },

  async down() {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    User.destroy({
      truncate: true,
      cascade: true,
    });
  },
};

function getIconName(filename) {
  return path.basename(filename, ".jpg").replace(/_/g, " ");
}
