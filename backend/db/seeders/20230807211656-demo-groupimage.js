'use strict';

const { GroupImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: "group1 image url1",
        preview: true
      },
      {
        groupId: 1,
        url: "group 1 image url2",
        preview: false
      },
      {
        groupId: 2,
        url: "group 2 image url",
        preview: true
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    await queryInterface.bulkDelete(options, null, {});
  }
};
