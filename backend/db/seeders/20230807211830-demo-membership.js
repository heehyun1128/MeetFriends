'use strict';

const { Membership } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Membership.bulkCreate([
      {
        userId:2,
        groupId:1,
        status: "co-host"
      },
      {
        userId:1,
        groupId:1,
        status: "organizer"
      },
      {
        userId:2,
        groupId:2,
        status: "organizer"
      },
      {
        userId:3,
        groupId:2,
        status: "co-host"
      },
      {
        userId:3,
        groupId:3,
        status: "organizer"
      },
      {
        userId:1,
        groupId:3,
        status: "pending"
      },
      {
        userId:4,
        groupId:4,
        status: "organizer"
      },
      {
        userId:4,
        groupId:3,
        status: "pending"
      },
      {
        userId:5,
        groupId:4,
        status: "co-host"
      },
      {
        userId:5,
        groupId:3,
        status: "pending"
      },
      {
        userId:5,
        groupId:5,
        status: "organizer"
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Memberships'
    await queryInterface.bulkDelete(options, null, {});
  }
};
