'use strict';

const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate([
      {
        // group1
        organizerId: 1, //user id is 1
        name: "Hiking Group",
        about: "This group is dedicated to New Yorkers who want to experience an outdoor adventure away from the city. We are determined in helping people find their interests and gather with others. We offer lunch, snacks, and water for attendees. Join us today to sign up for our incoming events",
        type: "In Person",
        private: false,
        city: "New York",
        state: "NY",
       
      },
      
      {
          // group2
        organizerId: 2,
        name: "UC Berkeley CEE",
        about: "This is a group formed by current students and alumni from UC Berkeley Civil and Environmental Engineering department. We are passional about finding students great social and networking opportunities that contribute to their personal and career growth.",
        type: "In Person",
        private: true,
        city: "Berkeley",
        state: "CA",
       
      },
      {
          // group3
        organizerId: 3,
        name: "UC Berkeley EECS",
        about: "This is a group formed by current students and alumni from UC Berkeley Electrical Engineering & Computer Sciences department. We are passional about finding students great social and networking opportunities that contribute to their personal and career growth.",
        type: "Online",
        private: false,
        city: "Berkeley",
        state: "CA",
     
      },
      {
          // group4
        organizerId: 4,
        name: "Gamers",
        about: "We do museum trips, ski trips, beach trips and all kinds of other fun events. This group is all about getting together to get to know new people and experience new things.",
        type: "In Person",
        private: true,
        city: "San Jose",
        state: "CA",
       
      },
      {
          // group5
        organizerId: 5,
        name: "San Jose Social Club",
        about: "We are a group of people who are devoted to help people grow. We offer all kinds of social networking events. Join us for more networking opportunities",
        type: "Online",
        private: false,
        city: "San Jose",
        state: "CA",
     
      },
      {
        // group1.1
        organizerId: 1, //user id is 1
        name: "Hiking Group 2",
        about: "This group is dedicated to New Yorkers who want to experience an outdoor adventure away from the city. We are determined in helping people find their interests and gather with others. We offer lunch, snacks, and water for attendees. Join us today to sign up for our incoming events",
        type: "In Person",
        private: false,
        city: "New York",
        state: "NY",

      },
      {
        // group1.1
        organizerId: 1, //user id is 1
        name: "Hiking Group 3",
        about: "This group is dedicated to New Yorkers who want to experience an outdoor adventure away from the city. We are determined in helping people find their interests and gather with others. We offer lunch, snacks, and water for attendees. Join us today to sign up for our incoming events",
        type: "In Person",
        private: false,
        city: "New York",
        state: "NY",

      },
    ],{ validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups'
    await queryInterface.bulkDelete(options, null, {});
     
  }
};
