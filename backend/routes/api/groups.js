const express = require('express');
// const cookieParser = require('cookie-parser');
const { requireAuth } = require("../../utils/auth")

const { Group, GroupImage, Membership, Attendance, User, Venue, sequelize } = require('../../db/models');

const { Op } = require('sequelize');


const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateEventInfoOnCreate = [
  check('venueId')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Venue does not exist")
    .custom(async (value) => {
      const venue = await Venue.findByPk(value)
      if (!venue) {
        throw new Error("Venue does not exist")
      }
    }),
  check("name")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .isIn(['Online', 'In Person'])
    .withMessage("Type must be Online or In person"),
  check("capacity")
    .isInt()
    .withMessage("Capacity must be an integer"),
  check("price")
    .isInt()
    .withMessage("Price is invalid"),
  check("description")
    .notEmpty()
    .withMessage("Description is required"),
  check("startDate")
    .isAfter()
    .withMessage("Start date must be a valid datetime and Start date must be in the future"),
  check("endDate")
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate)
      const endDate = new Date(value)
      if (!value || !req.body.startDate || endDate <= startDate) {
        throw new Error("End date must be a valid datetime and End date is less than start date")
      } else {
        return true
      }
    })
  ,
  handleValidationErrors
];

const validateImageOnCreate = [
  check('url')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Image url must be provided"),
  check('preview')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isBoolean()
    .withMessage("Image preview must be true or false")
  ,
  handleValidationErrors
]


const checkMembershipInput = [
  // const { memberId, status } = req.body
  check('memberId')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please Provide memberId")
    .custom(async (value, { req }) => {
      const membershipById = await Membership.findOne({
        where: { id: value }
      })
      if (!membershipById) {
        throw new Error("User couldn't be found")
      }
    }),
  check('status')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please Provide status")
    .custom(async (value,{req}) => {
      if (value === "pending") {
        throw new Error("Cannot change a membership status to pending")
      }
     const {memberId} = req.body
      const currGroup = await Group.findByPk(req.params.id)
      const membershipToUpdate = await currGroup.getMemberships({
      where: { id: memberId }
    })
     const membershipToUpdateObj = membershipToUpdate[0].toJSON()
      if (value === "co-host" && membershipToUpdateObj.status === "pending"){
        throw new Error("The membership is pending. Please accept the membership application before changing it to co-host")
      }
    
    })
  ,
  handleValidationErrors
]

const checkMemberDelInput = [
  // const { memberId, status } = req.body
  check('memberId')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please Provide memberId")
    .custom(async (value, { req }) => {
      const { memberId } = req.body
      const memberToDel = await Membership.findByPk(value, {
        where: {
          groupId: req.params.id
        }
      })
      if (!memberToDel) {
        throw new Error("User couldn't be found")
      }
    })
  ,
  handleValidationErrors
]
// handle 404 error on group id not found

const handleError404 = async (req, res, next) => {
  const currGroup = await Group.findByPk(req.params.id)

  if (!currGroup) {
    return next({
      status: 404,
      title: "404 Not Found",
      message: `Group ${req.params.id} couldn't be found`,
    })
  }
  next()
}

// handle 404 member to delete not exist
const handleMemDelError404 = async (req, res, next) => {
  const {memberId}=req.body
  const membershipToDel = await Membership.findByPk(memberId, {
    where: {
      groupId: req.params.id
    }
  })
  if (!membershipToDel) {
    return next({
      status: 404,
      message: "Membership does not exist for this User"
    })
  }
  next()
}



//handle authorization
// 403 error
const handleError403 = async (req, res, next) => {

  const currGroup = await Group.findByPk(req.params.id)
  //get the memberships current user has in the specified group
  const currUserMembershipInGroupArr = await currGroup.getMemberships({
    where: {
      userId: req.user.id
    }
  })
  if (currGroup.organizerId !== req.user.id) {
    if (currUserMembershipInGroupArr.length > 0) {
      const currUserMembershipInGroup = currUserMembershipInGroupArr[0].toJSON()
      if (currUserMembershipInGroup.status !== "co-host") {
        return next({
          status: 403,
          title: "403 Forbidden",
          message: "Forbidden",
        })
      } else {
        next()
      }
    } else {
      return next({
        status: 403,
        title: "403 Forbidden",
        message: "Forbidden",
      })
    }
  } else {
    next()
  }
}

//handle 403 error for adding image
const handleAddGroupImgErr403 = async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)
  if (req.user.id !== group.organizerId) {
    return next({
      status: 403,
      title: "403 Forbidden",
      message: "Forbidden",
    })

  } else {
    next()
  }
}

//handle 403 delete membership
// Current User must be the host of the group, or the user whose membership is being deleted
const handleDelMembership403 = async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)
  const { memberId } = req.body
  const memberToDel = await Membership.findByPk(memberId, {
    where: {
      groupId: req.params.id
    }
  })

  if (memberToDel && req.user.id !== group.organizerId && req.user.id !== memberToDel.userId) {
    return next({
      status: 403,
      title: "403 Forbidden",
      message: "Forbidden",
    })

  } else {
    next()
  }



}


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
      userId: req.user.id,
      status: {
        [Op.or]: ["co-host", "member", "organizer"]
      }
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
    for (let j = 0; j < groupImages.length; j++) {
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
      return next({
        status: 404,
        title: "404 Not Found",
        message: `Group ${req.params.id} couldn't be found`,
      })
    } else {
      const groupVenues = await currGroup.getVenues({
        attributes: {
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
      } else if (currUserMembershipInGroupArr.length > 0) {
        // console.log(currUserMembershipInGroupArr.length)
        const currUserMembershipInGroup = currUserMembershipInGroupArr[0].toJSON()

        if (currUserMembershipInGroup.status === "co-host") {
          res.status(200).json({ Venues: groupVenues })
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


// Get all Events of a Group specified by its id
// Returns all the events of a group specified by its id

// Require Authentication: false
router.get("/:id/events", async (req, res, next) => {
  try {
    const currGroup = await Group.findByPk(req.params.id)

    if (!currGroup) {
      return next({
        status: 404,
        title: "404 Not Found",
        message: `Group ${req.params.id} couldn't be found`,
      })
    } else {
      const currGroupEvents = await currGroup.getEvents({
        attributes: ["id", "groupId", "venueId", "name", "type", "startDate", "endDate"],
        include: [
          {
            model: Group,
            required: false,
            attributes: ["id", "name", "city", "state"]
          }, {
            model: Venue,
            required: false,
            attributes: ["id", "city", "state"]
          }]
      })


      // numAttending:
      let allGroupEventsArr = []
      for (let i = 0; i < currGroupEvents.length; i++) {
        let currGroupEvent = currGroupEvents[i]

        const groupEventAttendances = await currGroupEvent.getUsers({
          through: {
            model: Attendance,
            where: {
              status: "attending"
            }
          }
        })
        // previewImage
        const groupEventImages = await currGroupEvent.getEventImages({
          where: {
            preview: true
          }
        })
        currGroupEvent = currGroupEvent.toJSON()
        currGroupEvent.numAttending = groupEventAttendances.length
        if (groupEventImages.length){
          const groupEventImageUrl = groupEventImages[0].url
          currGroupEvent.previewImage = groupEventImageUrl
        }else{
          currGroupEvent.previewImage = null
        }

        allGroupEventsArr.push(currGroupEvent)
      }



      res.json({ Events: allGroupEventsArr })
    }
  } catch (err) {
    next(err)
  }

})



// Get all Members of a Group specified by its id
// Returns the members of a group specified by its id.
// Require Authentication: false
router.get("/:id/members", handleError404, async (req, res, next) => {
  // check if current user is an organizer or a co-host

  const currGroup = await Group.findByPk(req.params.id)
  //get all memberships in group
  const allGroupMemberships = await currGroup.getMemberships({
    include: {
      model: User
    }
  })
  const allMembersArr = []
  for (let i = 0; i < allGroupMemberships.length; i++) {
    const groupMember = allGroupMemberships[i]
    const member = {
      id: groupMember.id,
      firstName: groupMember.User.firstName,
      lastName: groupMember.User.lastName,
      Membership: {
        status: groupMember.status
      }
    }
    allMembersArr.push(member)
  }


  // get pending members
  const nonPendingMembers = await currGroup.getMemberships({
    where: {
      status: {
        [Op.not]: "pending"
      }
    }
  })

  const nonPendingMemberArr = []

  if (nonPendingMembers.length) {
    for (let i = 0; i < nonPendingMembers.length; i++) {
      const nonpendingMember = nonPendingMembers[i]
      const nonpendingMemberObj = {
        id: nonpendingMember.id,
        firstName: nonpendingMember.firstName,
        lastName: nonpendingMember.lastName,
        Membership: {
          status: nonpendingMember.status
        }
      }
      nonPendingMemberArr.push(nonpendingMemberObj)
    }
  }

  // get current user membership status
  const currUserMembership = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: req.params.id
    }
  })

  if (currGroup.organizerId === req.user.id) {
    res.status(200).json({ Members: allMembersArr })
  }

  if (currUserMembership && currUserMembership.status === "co-host") {
    res.status(200).json({ Members: allMembersArr })
  }
  res.status(200).json({ Members: nonPendingMemberArr })

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
      group: ['Group.id', 'GroupImages.id', 'Venues.id', 'Organizer.id']

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

  // add organizer membership to current user who's creating a group
  const currUser = await User.findByPk(req.user.id)
  const currUserMemInGroup = await currUser.createMembership({
    status: "organizer",
    groupId: newGroup.id
  })
  console.log(currUserMemInGroup)
  res.status(201).json(newGroup)
})


// Add an Image to a Group based on the Group's id
// Create and return a new image for a group specified by id.
// Require Authentication: true
// Require proper authorization: Current User must be the organizer for the group
router.post("/:id/images", requireAuth, handleError404, handleAddGroupImgErr403, validateImageOnCreate, async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)

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


  } catch (err) {
    next(err);
  }
})


// Create a new Venue for a Group specified by its id
// Creates and returns a new venue for a group specified by its id
// Require Authentication: true
// Require Authentication: Current User must be the organizer of the group or a member of the group with a status of "co-host"

router.post("/:id/venues", requireAuth, handleError404, handleError403, async (req, res, next) => {
  try {
    const currGroup = await Group.findByPk(req.params.id)


    const { address, city, state, lat, lng } = req.body
    const newGroupVenues = await currGroup.createVenue({
      address, city, state, lat, lng
    })
    //get the memberships current user has in the specified group
    const currUserMembershipInGroupArr = await currGroup.getMemberships({
      where: {
        userId: req.user.id
      }
    })
    res.status(200).json({ Venues: newGroupVenues })



  } catch (err) {
    next(err)
  }
})



// Create an Event for a Group specified by its id
// Creates and returns a new event for a group specified by its id
// Require Authentication: true
// Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.post("/:id/events", requireAuth, handleError404, handleError403, validateEventInfoOnCreate, async (req, res, next) => {

  try {
    const currGroup = await Group.findByPk(req.params.id)

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body



    //create new group event
    const newGroupEvent = await currGroup.createEvent({
      venueId, name, type, capacity, price, description, startDate, endDate
    })

    //check if current user has membership in the group
    //if in the group - check status
    const newGroupEventObj = {
      id: newGroupEvent.id,
      venueId: newGroupEvent.venueId,
      name: newGroupEvent.name,
      type: newGroupEvent.type,
      capacity: newGroupEvent.capacity,
      price: newGroupEvent.price,
      description: newGroupEvent.description,
      startDate: newGroupEvent.startDate,
      endDate: newGroupEvent.endDate
    }
    // console.log(newGroupEventObj)
    res.status(200).json(newGroupEventObj)


  } catch (err) {
    console.log(err)
    next(err);
  }
})



// Request a Membership for a Group based on the Group's id
// Require Authentication: true
router.post("/:id/membership", requireAuth, handleError404, async (req, res, next) => {
  const currGroup = await Group.findByPk(req.params.id)
  const currGroupMemberships = await currGroup.getMemberships()
  if (currGroupMemberships.length) {
    for (let i = 0; i < currGroupMemberships.length; i++) {
      const currMem = currGroupMemberships[i]
      if (currMem.userId === req.user.id) {
        if (currMem.status === "pending") {
          return next({
            status: 400,
            message: "Membership has already been requested"
          })
        } else {
          return next({
            status: 400,
            message: "User is already a member of the group"
          })
        }
      }
    }
  }

  const createNewMembership = await currGroup.createMembership({
    userId: req.user.id,
    status: "pending"
  })
  res.status(200).json(
    {
      memberId: createNewMembership.id,
      status: "pending"
    }
  )

})


// Change the status of a membership for a group specified by id.

// Require Authentication: true
// Require proper authorization:
// To change the status from "pending" to "member":
// Current User must already be the organizer or have a membership to the group with the status of "co-host"
// To change the status from "member" to "co-host":
// Current User must already be the organizer
router.put("/:id/membership", requireAuth, handleError404, handleError403, checkMembershipInput, async (req, res, next) => {
  try {
    const currGroup = await Group.findByPk(req.params.id)
    const { memberId, status } = req.body
    // find current user membership
    const currUserMembershipInGroup = await currGroup.getMemberships({
      where: {
        userId: req.user.id
      }
    })
    //  If specified membership does not exist
    const membershipById = await Membership.findOne({
      where: { id: memberId }
    })
  
    // Check if the membership exists
    const membershipToUpdate = await currGroup.getMemberships({
      where: { id: memberId }
    })
    // 404 If membership does not exist
    if (!membershipToUpdate.length) {
      return next({
        status: 404,
        message: "Membership between the user and the group does not exist"
      })
    } else {
      
      const membershipToUpdateObj = membershipToUpdate[0].toJSON()
      const userToUpdateMembership = await User.findByPk(membershipToUpdateObj.userId)
      const userIdToUpdate = userToUpdateMembership.id

      // authorization
      let currUserMembership = currUserMembershipInGroup[0].toJSON()
      // console.log(currUserMembership.status)
      if (currUserMembership.status === "organizer") {
        // To change the status from "pending" to "member"

        if (status === "member" && membershipToUpdateObj.status === "pending") {
          membershipToUpdate[0].status = "member"
          await membershipToUpdate[0].save()
          return res.json({
            id: userIdToUpdate,
            groupId: req.params.id,
            memberId: memberId,
            status: status
          })
        }
        // To change the status from "member" to "co-host":
        if (status === "co-host" && membershipToUpdateObj.status === "member") {
          membershipToUpdate[0].status = "co-host"
          await membershipToUpdate[0].save()
          return res.json({
            id: userIdToUpdate,
            groupId: req.params.id,
            memberId: memberId,
            status: status
          })
        }
      }
      if (currUserMembership.status === "co-host") {
        console.log(membershipToUpdate.status)
        // To change the status from "pending" to "member"
        if (status === "member" && membershipToUpdateObj.status === "pending") {
          membershipToUpdate[0].status = "member"
          await membershipToUpdate[0].save()
          return res.json({
            id: userIdToUpdate,
            groupId: req.params.id,
            memberId: memberId,
            status: status
          })
        }
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



// Delete a membership to a group specified by id.
// Require Authentication: true
// Require proper authorization: Current User must be the host of the group, or the user whose membership is being deleted
router.delete("/:id/membership", requireAuth, handleError404, handleMemDelError404,handleDelMembership403, checkMemberDelInput, async (req, res, next) => {
  // const group = await Group.findByPk(req.params.id)
  const { memberId } = req.body
  const membershipToDel = await Membership.findByPk(memberId, {
    where: {
      groupId: req.params.id
    }
  })
 
  await membershipToDel.destroy()
  res.status(200).json({
    "message": "Successfully deleted membership from group"
  })


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