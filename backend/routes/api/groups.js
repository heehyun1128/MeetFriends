const express = require('express');
// const cookieParser = require('cookie-parser');
const { requireAuth } = require("../../utils/auth")

const { Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');

const { Op } = require('sequelize');


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



// Get All Venues for a Group specified by its id
// Returns all venues for a group specified by its id

// Require Authentication: true

router.get("/:id/venues", requireAuth, async (req, res, next) => {
  try {
    const currGroup = await Group.findByPk(req.params.id)

    if (!currGroup) {
      next({
        status: 404,
        title: "404 Not Found",
        message: `Group ${req.params.id} couldn't be found`,
      })
    } else {
      const groupVenues = await currGroup.getVenues({
        attributes:{
          exclude: ["createdAt", "updatedAt"]
        }
      })
      //get the memberships current user has in the specified group
      const currUserMembershipInGroupArr = await currGroup.getMemberships({
        where: {
          userId: req.user.id
        }
      })
      console.log(currUserMembershipInGroupArr)
      //check if current user has membership in the group
      //if in the group - check status
      if (currGroup.organizerId === req.user.id) {
        res.status(200).json({ Venues: groupVenues })
      }else if (currUserMembershipInGroupArr.length>0) {
        // console.log(currUserMembershipInGroupArr.length)
        const currUserMembershipInGroup = currUserMembershipInGroupArr[0].toJSON()

        if (currUserMembershipInGroup.status === "co-host") {
          res.status(200).json({Venues:groupVenues})
        } else {
          next({
            status: 403,
            title: "403 Forbidden",
            message: "Forbidden",
          })
        }

      } else {
        next({
          status: 403,
          title: "403 Forbidden",
          message: "Forbidden",
        })
      }
    }

  } catch (err) {
    next(err)
  }




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
      group: ['Group.id', 'GroupImages.id', 'Venues.id','Organizer.id']

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


// Create a new Venue for a Group specified by its id
// Creates and returns a new venue for a group specified by its id

// Require Authentication: true
// Require Authentication: Current User must be the organizer of the group or a member of the group with a status of "co-host"

router.post("/:id/venues", requireAuth, async (req, res, next)=>{
  try {
    const currGroup = await Group.findByPk(req.params.id)

    if (!currGroup) {
      next({
        status: 404,
        title: "404 Not Found",
        message: `Group ${req.params.id} couldn't be found`,
      })
    } else {
      const {address,city,state,lat,lng} = req.body
      const newGroupVenues = await currGroup.createVenue({
        address, city, state, lat, lng
      })
      //get the memberships current user has in the specified group
      const currUserMembershipInGroupArr = await currGroup.getMemberships({
        where: {
          userId: req.user.id
        }
      })
      //check if current user has membership in the group
      //if in the group - check status
      if (currGroup.organizerId === req.user.id) {
        res.status(200).json({ Venues: newGroupVenues })
      }else if (currUserMembershipInGroupArr.length > 0) {
        // console.log(currUserMembershipInGroupArr.length)
        const currUserMembershipInGroup = currUserMembershipInGroupArr[0].toJSON()

        if (currUserMembershipInGroup.status === "co-host") {
          res.status(200).json({ Venues: newGroupVenues })
        } else {
          next({
            status: 403,
            title: "403 Forbidden",
            message: "Forbidden",
          })
        }

      } else {
        next({
          status: 403,
          title: "403 Forbidden",
          message: "Forbidden",
        })
      }
    }

  } catch (err) {
    next(err)
  }
})





// Edit a Group-Updates and returns an existing group.
// Require Authentication: true
// Require proper authorization: Group must belong to the current user
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    // check to see if id is provided and matched
    const { name, about, type, private, city, state } = req.body
    // console.log(private)
    // find group by Id after id is provided and matched
    const groupToUpdate = await Group.findByPk(req.params.id)
    // find group memberships
    if (groupToUpdate) {

      // authorization
      if (groupToUpdate.organizerId === req.user.id) {
        groupToUpdate.name = name
        groupToUpdate.about = about
        groupToUpdate.type = type
        groupToUpdate.private = private
        groupToUpdate.city = city
        groupToUpdate.state = state

        await groupToUpdate.save()
        return res.json(groupToUpdate)
      } else {
        next({
          status: 403,
          title: "403 Forbidden",
          message: "Forbidden",
        })
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


// Delete a Group-Deletes an existing group.

// Require Authentication: true
// Require proper authorization: Group must belong to the current user
router.delete("/:id", requireAuth, async (req, res, next) => {
  const groupToDel = await Group.findByPk(req.params.id)
  if (groupToDel) {
    if (groupToDel.organizerId === req.user.id) {
      await groupToDel.destroy()
      res.status(200).json({
        message: "Successfully deleted"
      })
    } else {
      next({
        status: 403,
        title: "403 Forbidden",
        message: "Forbidden",
      })
    }

  } else {
    next({
      status: 404,
      title: "404 Not Found",
      message: `Group ${req.params.id} couldn't be found`
    })
  }
})

module.exports = router;