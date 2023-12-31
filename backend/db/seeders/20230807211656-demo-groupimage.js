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
        groupId: 2,
        url: "https://v.fastcdn.co/u/f91f856b/63921554-0-paper-plane.png",
        preview: true
      },
      {
        groupId: 3,
        url: "https://v.fastcdn.co/u/f91f856b/63921559-0-Fist-bump.png",
        preview: true
      },
      {
        groupId: 4,
        url: "https://v.fastcdn.co/u/f91f856b/59389892-0-meetup.png",
        preview: true
      },
     
      {
        groupId: 5,
        url: "https://v.fastcdn.co/u/f91f856b/59389892-0-meetup.png",
        preview: true
      },
   
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    await queryInterface.bulkDelete(options, null, {});
  }
};
