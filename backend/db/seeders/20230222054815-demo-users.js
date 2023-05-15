"use strict";

const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcryptjs");
const { User, Icon, Tag, Tagging, Card, Lanyard } = require("../models");

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
      id: -1,
      firstName: "System",
      lastName: "Admin",
      email: "system.admin@mylanyard.org",
      passwordHash: bcrypt.hashSync("password"),
    });

    const colorIconImages = await fs.readdir(
      path.join(
        __dirname,
        "../../../frontend/public/system-images/colors/cropped"
      )
    );

    const colorTag = await Tag.create({
      authorId: admin.id,
      name: "colors",
    });

    const colorIcons = await Icon.bulkCreate(
      colorIconImages.map((filename) => {
        return {
          authorId: admin.id,
          name: getIconName(filename),
          imageUrl: `/system-images/colors/cropped/${filename}`,
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
      path.join(
        __dirname,
        "../../../frontend/public/system-images/emotions/cropped"
      )
    );

    const emotionTag = await Tag.create({
      authorId: admin.id,
      name: "emotions",
    });

    const emotionIcons = await Icon.bulkCreate(
      emotionIconImages.map((filename) => {
        return {
          authorId: admin.id,
          name: getIconName(filename),
          imageUrl: `/system-images/emotions/cropped/${filename}`,
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

    const upsetLanyard = await Lanyard.create({
      authorId: admin.id,
      name: "Upset",
      description: "Unpleasant emotions",
    });

    await Tagging.create({
      authorId: admin.id,
      tagId: emotionTag.id,
      lanyardId: upsetLanyard.id,
    });

    const upsetCards = await Card.bulkCreate(
      emotionIcons
        .filter((icon) => {
          switch (icon.name) {
            case "angry":
            case "mad":
            case "sad": {
              return true;
            }
            default: {
              return false;
            }
          }
        })
        .map((icon) => {
          return {
            authorId: admin.id,
            iconId: icon.id,
            lanyardId: upsetLanyard.id,
            text: icon.name,
          };
        }),
      {
        validate: true,
      }
    );

    await Tagging.bulkCreate(
      upsetCards.map((upsetCard) => {
        return {
          authorId: admin.id,
          tagId: emotionTag.id,
          cardId: upsetCard.id,
        };
      }),
      {
        validate: true,
      }
    );

    const foodIconImages = await fs.readdir(
      path.join(
        __dirname,
        "../../../frontend/public/system-images/foods/cropped"
      )
    );

    const foodTag = await Tag.create({
      authorId: admin.id,
      name: "foods",
    });

    const fruitTag = await Tag.create({
      authorId: admin.id,
      name: "fruits",
    });

    const drinkTag = await Tag.create({
      authorId: admin.id,
      name: "drinks",
    });

    const foodIcons = await Icon.bulkCreate(
      foodIconImages.map((filename) => {
        return {
          authorId: admin.id,
          name: getIconName(filename),
          imageUrl: `/system-images/foods/cropped/${filename}`,
        };
      }),
      {
        validate: true,
      }
    );

    const fruitIcons = foodIcons.filter((icon) => {
      switch (icon.name) {
        case "apple":
        case "banana":
        case "orange":
        case "strawberry":
        case "watermelon": {
          return true;
        }
        default: {
          return false;
        }
      }
    });

    const drinkIcons = foodIcons.filter((icon) => {
      switch (icon.name) {
        case "apple juice":
        case "bottled water":
        case "orange juice":
        case "milk":
        case "water": {
          return true;
        }
        default: {
          return false;
        }
      }
    });

    await Tagging.bulkCreate(
      [
        ...foodIcons.map((foodIcon) => {
          return {
            authorId: admin.id,
            tagId: foodTag.id,
            iconId: foodIcon.id,
          };
        }),
        ...fruitIcons.map((fruitIcon) => {
          return {
            authorId: admin.id,
            tagId: fruitTag.id,
            iconId: fruitIcon.id,
          };
        }),
        ...drinkIcons.map((drinkIcon) => {
          return {
            authorId: admin.id,
            tagId: drinkTag.id,
            iconId: drinkIcon.id,
          };
        }),
      ],
      {
        validate: true,
      }
    );

    const fruitLanyard = await Lanyard.create({
      authorId: admin.id,
      name: "Fruit",
      description: "Healthy snacks",
    });

    const drinkLanyard = await Lanyard.create({
      authorId: admin.id,
      name: "Drink",
    });

    await Tagging.bulkCreate(
      [
        {
          authorId: admin.id,
          tagId: foodTag.id,
          lanyardId: fruitLanyard.id,
        },
        {
          authorId: admin.id,
          tagId: foodTag.id,
          lanyardId: drinkLanyard.id,
        },
        {
          authorId: admin.id,
          tagId: fruitTag.id,
          lanyardId: fruitLanyard.id,
        },
        {
          authorId: admin.id,
          tagId: drinkTag.id,
          lanyardId: drinkLanyard.id,
        },
      ],
      {
        validate: true,
      }
    );

    const fruitCards = await Card.bulkCreate(
      fruitIcons.map((icon) => {
        return {
          authorId: admin.id,
          iconId: icon.id,
          lanyardId: fruitLanyard.id,
          text: icon.name,
        };
      }),
      {
        validate: true,
      }
    );

    const drinkCards = await Card.bulkCreate(
      drinkIcons.map((icon) => {
        return {
          authorId: admin.id,
          iconId: icon.id,
          lanyardId: drinkLanyard.id,
          text: icon.name,
        };
      }),
      {
        validate: true,
      }
    );

    await Tagging.bulkCreate(
      [
        ...fruitCards.flatMap((fruitCard) => {
          return [
            {
              authorId: admin.id,
              tagId: foodTag.id,
              cardId: fruitCard.id,
            },
            {
              authorId: admin.id,
              tagId: fruitTag.id,
              cardId: fruitCard.id,
            },
          ];
        }),
        ...drinkCards.flatMap((drinkCard) => {
          return [
            {
              authorId: admin.id,
              tagId: foodTag.id,
              cardId: drinkCard.id,
            },
            {
              authorId: admin.id,
              tagId: drinkTag.id,
              cardId: drinkCard.id,
            },
          ];
        }),
      ],
      {
        validate: true,
      }
    );

    const otherIconImages = await fs.readdir(
      path.join(
        __dirname,
        "../../../frontend/public/system-images/other/cropped"
      )
    );

    const otherTag = await Tag.create({
      authorId: admin.id,
      name: "others",
    });

    const otherIcons = await Icon.bulkCreate(
      otherIconImages.map((filename) => {
        return {
          authorId: admin.id,
          name: getIconName(filename),
          imageUrl: `/system-images/other/cropped/${filename}`,
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

    await User.create({
      firstName: "Temple",
      lastName: "Grandin",
      email: "demo.user@mylanyard.org",
      passwordHash: bcrypt.hashSync("password"),
    });
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
