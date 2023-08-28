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
        name: "Central Park Loop Hiking",
        description:"Come and meet friends who love hiking.",
        type: "In Person",
        capacity:30,
        price:20,
        startDate: new Date("2023-12-10 10:00:00"),
        endDate: new Date("2023-12-10 14:00:00"),
      },
      {
        // event2
        venueId: 2,
        groupId: 2,
        name: "Berkeley Civil Engineering Department Career Fair",
        description:"Looking for your first job or opportunities to boost your career? Come and join us at Davis Hall",
        type: "In Person",
        capacity:150,
        price:30,
        startDate: new Date("2023-11-28 20:00:00"),
        endDate: new Date("2023-11-28 22:00:00"),
      },
      {
        // event3
        venueId: null,
        groupId: 3,
        name: "UC Berkeley EECS Tech and Startup Networking-Online",
        description:"Join us to meet with some of the industry's most innovative and exciting startup founders. This is an excellent opportunity to make new connections, share your ideas and interests, and learn from the experiences of others.",
        type: "Online",
        capacity:100,
        price:30,
        startDate: new Date("2023-11-19 18:00:00"),
        endDate: new Date("2023-11-19 20:00:00"),
      },
      {
        // event4
        venueId: 3,
        groupId: 3,
        name: "UC Berkeley EECS Tech and Startup Networking-In Person",
        description:"Join us to meet with some of the industry's most innovative and exciting startup founders. This is an excellent opportunity to make new connections, share your ideas and interests, and learn from the experiences of others.",
        type: "In Person",
        capacity:100,
        price:30,
        startDate: new Date("2023-11-19 18:00:00"),
        endDate: new Date("2023-11-19 20:00:00"),
      },
      {
        // event5
        venueId: 4,
        groupId: 4,
        name: "Game Night!",
        description:"Description of Event 4",
        type: "In Person",
        capacity:120,
        price:15,
        startDate: new Date("2023-10-28 17:00:00"),
        endDate: new Date("2023-10-28 22:00:00"),
      },
      {
        // event6
        venueId: null,
        groupId: 5,
        name: "Unlock a second income!",
        description:"Want to make a second source of income? Join us to learn about potential money-making opportunities!",
        type: "Online",
        capacity:60,
        price:40,
        startDate: new Date("2024-1-10 18:00:00"),
        endDate: new Date("2024-1-10 22:00:00"),
      },
      {
        // event7
        venueId: 5,
        groupId: 5,
        name: "Professional Outdoor Networking Event",
        description: "Join us to make connections with co-founders, partners, coaches or core team members for your career growth and potential hiring opportunities",
        type: "In Person",
        capacity: 100,
        price: 55,
        startDate: new Date("2023-10-20 16:00:00"),
        endDate: new Date("2023-10-20 20:00:00"),
      },
      {
    
        venueId: 1,
        groupId: 1,
        name: "Networking Event 2022",
        description: "Join us to make connections with co-founders, partners, coaches or core team members for your career growth and potential hiring opportunities",
        type: "In Person",
        capacity: 100,
        price: 55,
        startDate: new Date("2022-10-20 16:00:00"),
        endDate: new Date("2022-10-20 20:00:00"),
      },
      {
    
        venueId: 1,
        groupId: 1,
        name: "Networking Event 2021",
        description: "Join us to make connections with co-founders, partners, coaches or core team members for your career growth and potential hiring opportunities",
        type: "In Person",
        capacity: 100,
        price: 55,
        startDate: new Date("2021-12-20 16:00:00"),
        endDate: new Date("2021-12-20 20:00:00"),
      },
      {
      
        venueId: 1,
        groupId: 1,
        name: "Hiking Hiking",
        description: "Come and meet friends who love hiking.",
        type: "In Person",
        capacity: 30,
        price: 20,
        startDate: new Date("2023-11-15 10:00:00"),
        endDate: new Date("2023-11-15 16:00:00"),
      },
     
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events'
    await queryInterface.bulkDelete(options, null, {});
  }
};
