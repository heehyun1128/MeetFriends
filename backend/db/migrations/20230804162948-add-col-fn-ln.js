'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName ='Users'

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(options, 'firstName', {  // options object
      type: Sequelize.STRING(30),
      allowNull: false,
    })
    await queryInterface.addColumn(options, 'lastName', {  // options object
      type: Sequelize.STRING(30),
      allowNull: false,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(options, 'firstName') // options object
    await queryInterface.removeColumn(options, 'lastName')  // options object
  }
};
