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
        url: "group 2 image url 1",
        preview: true
      },
      {
        groupId: 2,
        url: "group 2 image url 2",
        preview: true
      },
      {
        groupId: 3,
        url: "group 3 image url 1",
        preview: true
      },
      {
        groupId: 3,
        url: "group 3 image url 2",
        preview: true
      },
      {
        groupId: 3,
        url: "group 3 image url 3",
        preview: true
      },
      {
        groupId: 4,
        url: "group 4 image url 1",
        preview: true
      },
      {
        groupId: 5,
        url: "group 5 image url 1",
        preview: true
      },
      {
        groupId: 5,
        url: "group 5 image url 2",
        preview: true
      },
      {
        groupId: 5,
        url: "group 5 image url 3",
        preview: true
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    await queryInterface.bulkDelete(options, null, {});
  }
};
