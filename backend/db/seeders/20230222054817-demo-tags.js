"use strict";

const { Tag } = require("../models");

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
  },

  async down() {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    Tag.destroy({
      truncate: true,
      cascade: true,
    });
  },
};
