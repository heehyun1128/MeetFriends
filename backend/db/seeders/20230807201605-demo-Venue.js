'use strict';

const { Venue } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Venue.bulkCreate([
      {
        // venue1
        groupId: 1,
        address: "123 Disney Lane",
        city: "New York",
        state: "NY",
        lat: 37.7645358,
        lng: -122.4730327,
      },
      {
        // venue2
        groupId: 2,
        address: "UC Berkeley Davis Hall",
        city: "Berkeley",
        state: "CA",
        lat: 37.5228203,
        lng: 122.1529898,
        
      }
      
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Venues'
    await queryInterface.bulkDelete(options, null, {});
  }
};
