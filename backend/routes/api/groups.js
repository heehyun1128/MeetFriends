const express = require('express');
// const cookieParser = require('cookie-parser');
const { requireAuth } = require("../../utils/auth")

const { Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');

const { Op } = require('sequelize')

const router = express.Router();

//Get all Groups - Require Authentication: false
router.get("/", async (req, res, next) => {
  const allGroups = await Group.findAll({
    attributes: ["id", "organizerId", "name", "about", "type", "private", "city", "state", "createdAt", "updatedAt"],
    include: [
      {
        model: Membership,
        attributes: []
      },
      // {
      //   model: GroupImage,
      //   attributes: [],
      //   where: {
      //     preview: true
      //   }
      // }
    ],
    attributes: {
      include: [
        [
          sequelize.fn('COUNT', sequelize.literal('DISTINCT "Memberships"."id"')), "numMembers"
        ],
        // [sequelize.col('GroupImages.url'), 'previewImage']
      ]
    },
    group: ['Group.id']

  })
  let groups = []
  for (let i = 0; i < allGroups.length; i++) {
    let group = allGroups[i]
    const groupImages = await group.getGroupImages()
    group = group.toJSON()
    
    group.previewImage =null
    for (let i = 0; i < groupImages.length; i++) {
      
      let groupImage = groupImages[i].toJSON()
      if(groupImage.preview===true){
        
        group.previewImage = groupImage.url

      }
    }
    groups.push(group)

    // console.log(groups)
  }

  res.json({ Groups: groups })
  // res.json(allGroups)
})

// Get all Groups joined or organized by the Current User
// Returns all the groups.
// Require Authentication: true
router.get("/current", requireAuth, async (req, res, next) => {

  const userMemberships = await Membership.findAll({
    where: {
      userId: req.user.id
    },
    include: {
      model: Group
    }
  })


  let groups = []
  for (let i = 0; i < userMemberships.length; i++) {
    let group = userMemberships[i].Group

    const groupMemberships = await group.getMemberships()
    const groupImages = await group.getGroupImages({
      where: {
        preview: true
      }
    })

    group = group.toJSON()
    group.numMembers = groupMemberships.length

    for (let i = 0; i < groupImages.length; i++) {
      let groupImage = groupImages[0].toJSON()
      let url = groupImage.url
      group.previewImage = url
    }

    groups.push(group)
  }

  res.json({ Groups: groups })

})

// Get details of a Group from an id
router.get("/:id", async (req, res, next) => {
  let findGroupsById
  try {
    findGroupsById = await Group.findByPk(req.params.id, {
      attributes: ["id", "organizerId", "name", "about", "type", "private", "city", "state", "createdAt", "updatedAt"],
      include: [
        {
          model: Membership,
          attributes: []
        },
        {
          model: GroupImage,
          attributes: ["id", "url", "preview"]
        },
        {
          model: User,
          as: "Organizer",
          attributes: ["id", "firstName", "lastName"]
        },
        {
          model: Venue,
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        },

      ],
      attributes: {
        include: [
          [
            sequelize.fn('COUNT', sequelize.literal('DISTINCT "Memberships"."id"')), "numMembers"
          ],

        ]
      },
      group: ['Group.id']

    })
    if (findGroupsById) {
      res.json(findGroupsById)
    } else {
      next(
        {

          title: "404 Not Found",
          message: `Group ${req.params.id} couldn't be found`,
        }
      )
    }
  } catch (err) {
    next(err);
  }

})

module.exports = router;