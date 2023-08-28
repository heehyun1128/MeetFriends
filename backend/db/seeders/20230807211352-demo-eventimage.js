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
        url: "https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384",
        preview: true
      },
      {
        eventId: 1,
        url: "https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384",
        preview: true
      },
      {
        eventId: 2,
        url: "https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384",
        preview: true
      },
      {
        eventId: 2,
        url: "https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384",
        preview: true
      },
      {
        eventId: 3,
        url: "https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384",
        preview: true
      },
      {
        eventId: 3,
        url: "https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384",
        preview: true
      },
      {
        eventId: 3,
        url: "https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384",
        preview: true
      },
      {
        eventId: 4,
        url: "https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384",
        preview: true
      },
      {
        eventId: 5,
        url: "https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384",
        preview: true
      },
      {
        eventId: 5,
        url: "https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384",
        preview: true
      },
      {
        eventId: 5,
        url: "https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384",
        preview: true
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'EventImages'
    await queryInterface.bulkDelete(options, null, {});
  }
};
