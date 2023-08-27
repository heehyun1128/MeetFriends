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
        price:60,
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
        capacity:100,
        price:30,
        startDate: new Date("2023-11-19 14:00:00"),
        endDate: new Date("2023-11-19 18:00:00"),
      },
      {
        // event4
        venueId: 4,
        groupId: 4,
        name: "Event 4",
        description:"Description of Event 4",
        type: "In Person",
        capacity:120,
        price:55,
        startDate: new Date("2023-10-28 16:00:00"),
        endDate: new Date("2023-10-28 20:00:00"),
      },
      {
        // event5
        venueId: null,
        groupId: 5,
        name: "Online Event 5",
        description:"Description of Event 5",
        type: "Online",
        capacity:60,
        price:40,
        startDate: new Date("2024-1-10 18:00:00"),
        endDate: new Date("2024-1-10 22:00:00"),
      },
      {
        // event6
        venueId: 5,
        groupId: 5,
        name: "Event 6",
        description: "Description of Event 6",
        type: "In Person",
        capacity: 100,
        price: 65,
        startDate: new Date("2023-10-20 16:00:00"),
        endDate: new Date("2023-10-20 20:00:00"),
      },
     
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events'
    await queryInterface.bulkDelete(options, null, {});
  }
};
