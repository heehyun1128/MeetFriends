'use strict';

const { EventImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: "https://images.pexels.com/photos/2076968/pexels-photo-2076968.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview: true
      },
      {
        eventId: 2,
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqnj5_oLyOoLcjAy4X7APGX8aO-SIoVbnMkQ&usqp=CAU",
        preview: true
      },
     
      {
        eventId: 3,
        url: "https://images.pexels.com/photos/2566573/pexels-photo-2566573.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview: true
      },
     
      {
        eventId: 4,
        url: "https://images.pexels.com/photos/459762/pexels-photo-459762.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview: true
      },
      {
        eventId: 5,
        url: "https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview: true
      },
      {
        eventId: 6,
        url: "https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview: true
      },
      {
        eventId: 7,
        url: "https://images.pexels.com/photos/860227/pexels-photo-860227.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview: true
      },
      {
        eventId: 8,
        url: "https://images.everydayhealth.com/images/health-benefits-of-swimming-1440x810.jpg?sfvrsn=e6f62752_4",
        preview: true
      },
      {
        eventId: 9,
        url: "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview: true
      },
      {
        eventId: 10,
        url: "https://images.pexels.com/photos/5480713/pexels-photo-5480713.jpeg?auto=compress&cs=tinysrgb&w=800",
        preview: true
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'EventImages'
    await queryInterface.bulkDelete(options, null, {});
  }
};
