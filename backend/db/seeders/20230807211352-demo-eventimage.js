'use strict';

const { EventImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: "event1 image url",
        preview: true
      },
      {
        eventId: 1,
        url: "event 1 image url",
        preview: true
      },
      {
        eventId: 2,
        url: "event 2 image url",
        preview: true
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'EventImages'
    await queryInterface.bulkDelete(options, null, {});
  }
};
