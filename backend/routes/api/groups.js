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

    group.previewImage = null
    for (let i = 0; i < groupImages.length; i++) {

      let groupImage = groupImages[i].toJSON()
      if (groupImage.preview === true) {

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
          status: 404,
          title: "404 Not Found",
          message: `Group ${req.params.id} couldn't be found`,
        }
      )
    }
  } catch (err) {
    next(err);
  }

})


// Create a Group
// Creates and returns a new group.
// Require Authentication: true
router.post("/", requireAuth, async (req, res, next) => {

  const { name, about, type, private, city, state } = req.body
  const newGroup = await Group.create({
    organizerId: req.user.id,
    name,
    about,
    type,
    private,
    city,
    state,
  })

  res.status(201).json(newGroup)
})


// Add an Image to a Group based on the Group's id
// Create and return a new image for a group specified by id.
// Require Authentication: true
// Require proper authorization: Current User must be the organizer for the group
router.post("/:id/images", requireAuth, async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    if (!group) {
      next({
        status: 404,
        title: "404 Not Found",
        message: `Group ${req.params.id} couldn't be found`
      })
    }

    // authorization
    if (req.user.id !== group.organizerId) {
      next({
        status: 403,
        title: "403 Forbidden",
        message: "Forbidden",
      })
    } else {
      const newGroupImage = await group.createGroupImage(
        {
          url: "image url",
          preview: true
        }
      )
      res.json({
        id: newGroupImage.id,
        url: newGroupImage.url,
        preview: newGroupImage.preview,
      })
    }

  } catch (err) {
    next(err);
  }
})


// Edit a Group-Updates and returns an existing group.
// Require Authentication: true
// Require proper authorization: Group must belong to the current user
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    // check to see if id is provided and matched
    const { name, about, type, private, city, state } = req.body
    console.log(private)
    // find group by Id after id is provided and matched
    const groupToUpdate = await Group.findByPk(req.params.id)
    // find group memberships
    if (groupToUpdate) {
      const groupMemberships = await groupToUpdate.getMemberships()
      for (let i = 0; i < groupMemberships.length; i++) {
        let groupMembership = groupMemberships[i].toJSON()
        // authorization
        if (groupToUpdate.organizerId === req.user.id || groupMembership.userId === req.user.id) {

          if (name) {
            groupToUpdate.name = name
          }
          if (about) {
            groupToUpdate.about = about
          }
          if (type) {
            groupToUpdate.type = type
          }
          if (private !== undefined) {
            groupToUpdate.private = private
            
          }
          if (city) {
            groupToUpdate.city = city
          }
          if (state) {
            groupToUpdate.state = state
          }
          await groupToUpdate.save()
          return res.json(groupToUpdate)
        } else {
          next({
            status: 403,
            title: "403 Forbidden",
            message: "Forbidden",
          })
        }
      }
    } else {
      next({
        status: 404,
        title: "404 Not Found",
        message: `Group ${req.params.id} couldn't be found`
      })
    }
  } catch (err) {
    next(err);
  }
})




module.exports = router;