'use strict';
const path = require('path');
const { GroupImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
// const getImageUrl = fileName =>{
//   return path.join(__dirname,'../../images' ,fileName)
// }
// const imageUrl = getImageUrl('groupImage1.jpg')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
        preview: true
      },
      {
        groupId: 1,
        url: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
        preview: false
      },
      {
        groupId: 2,
        url: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
        preview: true
      },
      {
        groupId: 2,
        url: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
        preview: true
      },
      {
        groupId: 3,
        url: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
        preview: true
      },
      {
        groupId: 3,
        url: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
        preview: true
      },
      {
        groupId: 3,
        url: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
        preview: true
      },
      {
        groupId: 4,
        url: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
        preview: true
      },
      {
        groupId: 5,
        url: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
        preview: true
      },
      {
        groupId: 6,
        url: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
        preview: true
      },
      {
        groupId: 7,
        url: "https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384",
        preview: true
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    await queryInterface.bulkDelete(options, null, {});
  }
};
