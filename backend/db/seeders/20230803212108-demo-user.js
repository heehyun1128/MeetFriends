'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName:'Demo',
        lastName:'Lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user2@user2.com',
        username: 'FakeUser2',
        firstName:'Fake2',
        lastName:'User2',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user3@user3.com',
        username: 'FakeUser3',
        firstName:'Fake3',
        lastName:'User3',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user4@user4.com',
        username: 'FakeUser4',
        firstName:'Fake4',
        lastName:'User4',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user5@user5.com',
        username: 'FakeUser5',
        firstName:'Fake5',
        lastName:'User5',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user6@user6.com',
        username: 'FakeUser6',
        firstName:'Fake6',
        lastName:'User6',
        hashedPassword: bcrypt.hashSync('password')
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4', 'FakeUser5'] }
    }, {});
  }
};