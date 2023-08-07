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
        status: "member"
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
        userId:1,
        groupId:3,
        status: "pending"
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Membership'
    await queryInterface.bulkDelete(options, null, {});
  }
};
