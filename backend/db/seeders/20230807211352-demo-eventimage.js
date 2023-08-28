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
        url: "event1 image url 1",
        preview: true
      },
      {
        eventId: 1,
        url: "event 1 image url 2",
        preview: true
      },
      {
        eventId: 2,
        url: "event 2 image url 1",
        preview: true
      },
      {
        eventId: 2,
        url: "event 2 image url 2",
        preview: true
      },
      {
        eventId: 3,
        url: "event 3 image url 1",
        preview: true
      },
      {
        eventId: 3,
        url: "event 3 image url 2",
        preview: true
      },
      {
        eventId: 3,
        url: "event 3 image url 3",
        preview: true
      },
      {
        eventId: 4,
        url: "event 4 image url",
        preview: true
      },
      {
        eventId: 5,
        url: "event 5 image url",
        preview: true
      },
      {
        eventId: 5,
        url: "event 5 image url 1",
        preview: true
      },
      {
        eventId: 5,
        url: "event 5 image url 2",
        preview: true
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'EventImages'
    await queryInterface.bulkDelete(options, null, {});
  }
};
