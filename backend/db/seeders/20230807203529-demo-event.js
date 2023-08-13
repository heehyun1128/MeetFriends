'use strict';

const { Event } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        // event1
        venueId: 1,
        groupId: 1,
        name: "Event 1",
        description:"Description of Event 1",
        type: "In Person",
        capacity:50,
        price:80,
        startDate: new Date("2023-12-10 14:00:00"),
        endDate: new Date("2023-12-10 18:00:00"),
      },
      {
        // event2
        venueId: 2,
        groupId: 2,
        name: "Berkeley Event",
        description:"Description of Berkeley Event",
        type: "In Person",
        capacity:150,
        price:50,
        startDate: new Date("2023-11-28 20:00:00"),
        endDate: new Date("2023-11-28 22:00:00"),
      },
      {
        // event3
        venueId: null,
        groupId: 3,
        name: "Online Event",
        description:"Description of Event",
        type: "Online",
        capacity:50,
        price:50,
        startDate: new Date("2023-11-19 20:00:00"),
        endDate: new Date("2023-11-19 22:00:00"),
      },
     
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events'
    await queryInterface.bulkDelete(options, null, {});
  }
};
