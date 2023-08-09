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
        name: "Group 1",
        about: "About Group 1. If you use the ModelName.bulkCreate() method for seeding data with Sequelize, the schema is set by the Sequelize models so there is not need for us to specify the schema when using Model.bulkCreate(). Here's an example of how to use bulkCreate with the validate: true as the only key-value pair in the query options object",
        type: "In Person",
        private: true,
        city: "New York",
        state: "NY",
       
      },
      {
          // group2
        organizerId: 2,
        name: "Group 2",
        about: "About Group 2.If you use the ModelName.bulkCreate() method for seeding data with Sequelize, the schema is set by the Sequelize models so there is not need for us to specify the schema when using Model.bulkCreate(). Here's an example of how to use bulkCreate with the validate: true as the only key-value pair in the query options object",
        type: "In Person",
        private: true,
        city: "Berkeley",
        state: "CA",
       
      },
      {
          // group3
        organizerId: 3,
        name: "Group 3",
        about: "About Group 3.If you use the ModelName.bulkCreate() method for seeding data with Sequelize, the schema is set by the Sequelize models so there is not need for us to specify the schema when using Model.bulkCreate(). Here's an example of how to use bulkCreate with the validate: true as the only key-value pair in the query options object",
        type: "Online",
        private: false,
        city: "Seattle",
        state: "WA",
     
      },
    ],{ validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups'
    await queryInterface.bulkDelete(options, null, {});
     
  }
};
