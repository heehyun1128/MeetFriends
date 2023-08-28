'use strict';

const { Attendance } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Attendance.bulkCreate([
      {
        eventId:1,
        userId:1,
        status:"attending"
      },
      {
        eventId:1,
        userId:2,
        status:"pending"
      },
      {
        eventId:2,
        userId:3,
        status:"attending"
      },
      {
        eventId:3,
        userId:4,
        status:"pending"
      },
      {
        eventId:4,
        userId:5,
        status:"attending"
      },
      {
        eventId:5,
        userId:6,
        status:"attending"
      },
      {
        eventId:2,
        userId:1,
        status:"pending"
      },
      {
        eventId:3,
        userId:2,
        status:"pending"
      },
      {
        eventId:4,
        userId:3,
        status:"attending"
      },
      {
        eventId:5,
        userId:4,
        status:"pending"
      },
      {
        eventId:6,
        userId:5,
        status:"attending"
      },
      {
        eventId:6,
        userId:6,
        status:"attending"
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances'
    await queryInterface.bulkDelete(options, null, {});
  }
};
