const express = require('express');
// const cookieParser = require('cookie-parser');
const { requireAuth } = require("../../utils/auth")

const { Group, GroupImage, Membership, Attendance, User, Venue, sequelize, Event } = require('../../db/models');

const { Op } = require('sequelize');

const router = express.Router();


const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateEventInfoOnCreate = [
  check('venueId')
    // .exists({ checkFalsy: true })
    // .notEmpty()
    // .withMessage("Venue does not exist")
    .custom(async (value) => {
      // console.log(typeof value)
      if (value !== null) {
        if (typeof value !== "number") {
          throw new Error("Venue does not exist")
        } else {
          const venue = await Venue.findByPk(value)
          if (!venue) {
            throw new Error("Venue does not exist")
          }
        }
      }
      return true
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
    .isDecimal()
    .withMessage("Price is invalid"),
  check("description")
    .notEmpty()
    .withMessage("Description is required"),
  check("startDate")
    .isAfter()
    .withMessage("Start date must be in the future")
    .isISO8601()
    .custom(value => {
      // use regex to check date format
      const dateFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
      if (!dateFormat.test(value)) {
        throw new Error("Start date must be a valid datetime")
      }
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        throw new Error("Start date must be a valid datetime")
      }
      return true
    })
    .withMessage("Start date must be a valid datetime")
  ,
  check("endDate")
    .isISO8601()
    .custom((value, { req }) => {
      // use regex to check date format
      const dateFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
      if (!dateFormat.test(value)) {
        throw new Error("End date must be a valid datetime")
      }
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        throw new Error("End date must be a valid datetime")
      }
      const startDate = new Date(req.body.startDate)
      const endDate = new Date(value)
      if (endDate <= startDate) {
        throw new Error("End date should be later than start date")
      }
      return true
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
    // .exists({ checkFalsy: true })
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
      const membershipById = await User.findByPk(value)
      if (!membershipById) {
        throw new Error("User couldn't be found")
      }
    }),
  check('status')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please Provide status")

    .custom(async (value, { req }) => {
      if (value === "pending") {
        throw new Error("Cannot change a membership status to pending")
      }

    })
    .isIn(["co-host", "member", "pending", "organizer"])
    .withMessage("Membership status must be co-host, member,organizer")
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
      const memberToDel = await User.findOne({
        where: {
          id: memberId
        }
      })
      if (!memberToDel) {
        throw new Error("User couldn't be found")
      }
    })
  ,
  handleValidationErrors
]

const checkCreateGroupInput = [
  // const { memberId, status } = req.body
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Name is required"),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check('about')
    .exists({ checkFalsy: true })
    .isLength({ min: 30 })
    .withMessage("Description must be at least 30 characters long"),
  check('type')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Group Type is required"),
  check('private')
    .exists({ checkFalsy: true })
    .notEmpty()
    // .isBoolean()
    .withMessage("Visibility Type is required"),
  check('imageUrl')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("")
    .custom(value => {
      if (!value.endsWith(".png") && !value.endsWith(".jpg") && !value.endsWith(".jpeg")) {
        throw new Error("Image URL must end in .png, .jpg, or .jpeg")
      }
      return true
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
  const { memberId } = req.body
  const membershipToDel = await Membership.findOne({
    where: {
      userId: memberId,
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


// handle del group 403
const handleDelGroup403 = async (req, res, next) => {
  const groupToDel = await Group.findByPk(req.params.id)
  if (groupToDel) {
    if (groupToDel.organizerId !== req.user.id) {
      next({
        status: 403,
        title: "403 Forbidden",
        message: "Forbidden",
      })
    } else {
      next()
    }
  } else {
    next()
  }
}



//handle 403 delete membership
// Current User must be the host of the group, or the user whose membership is being deleted
const handleDelMembership403 = async (req, res, next) => {
  const group = await Group.findByPk(req.params.id)
  const { memberId } = req.body
  const memberToDel = await Membership.findOne({
    where: {
      userId: memberId,
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


  })
  let groups = []
  for (let i = 0; i < allGroups.length; i++) {
    let group = allGroups[i]
    const groupImages = await group.getGroupImages()
    const groupEvents = await group.getEvents()
    const groupMemberships = await group.getMemberships({
      where: {
        status: {
          [Op.in]: ["organizer", "co-host", "member"]
        }
      }
    })
    group = group.toJSON()
    group.numEvents = groupEvents.length ? groupEvents.length : 0
    group.numMembers = groupMemberships.length ? groupMemberships.length : 0
    group.organizer = await User.findByPk(group.organizerId)

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

    const groupMemberships = await group.getMemberships({
      where: {
        status: {
          [Op.or]: ["co-host", "member", "organizer"]
        }
      }
    })
    const groupImages = await group.getGroupImages({
      where: {
        preview: true
      }
    })
    group = group.toJSON()
    group.numMembers = groupMemberships.length
    group.previewImage = null
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
      // console.log(currUserMembershipInGroupArr)
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
        if (groupEventImages.length) {
          const groupEventImageUrl = groupEventImages[0].url
          currGroupEvent.previewImage = groupEventImageUrl
        } else {
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
  try {
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
        id: groupMember.User.id,
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
      include: {
        model: User
      },
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
          id: nonpendingMember.User.id,
          firstName: nonpendingMember.User.firstName,
          lastName: nonpendingMember.User.lastName,
          Membership: {
            status: nonpendingMember.status
          }
        }
        nonPendingMemberArr.push(nonpendingMemberObj)
      }
    }

    // get current user membership status

    let currUserMembership
    if (req.user) {
      currUserMembership = await Membership.findOne({
        where: {
          userId: req.user.id,
          groupId: req.params.id
        }
      })
      if (currGroup.organizerId === req.user.id || (currUserMembership && currUserMembership.status === "co-host")) {
        return res.status(200).json({ Members: allMembersArr })
      }

    }

    res.status(200).json({ Members: nonPendingMemberArr })
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
          attributes: [],
          where: {
            status: {
              [Op.or]: ["co-host", "member", "organizer"]
            }
          }
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
            sequelize.cast(sequelize.fn('COUNT', sequelize.literal('DISTINCT "Memberships"."id"')), 'integer'), "numMembers"
          ],
        ]
      },
      group: ['Group.id', 'GroupImages.id', 'Venues.id', 'Organizer.id']

    })
    if (findGroupsById) {
      // const previewImage = findGroupsById.groupImage
      // console.log(findGroupsById.toJSON().GroupImages)
      // const groupImageArr = findGroupsById.GroupImages
      // const previewImage=groupImageArr.filter(image=>image.preview===true)
      // console.log(previewImage)
      // res.json({
      //   ...findGroupsById,
      //   previewImage:previewImage[0]
      // })
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
router.post("/", requireAuth, checkCreateGroupInput, async (req, res, next) => {

  const { name, about, type, private, city, state, imageUrl } = req.body
  const newGroup = await Group.create({
    organizerId: req.user.id,
    name,
    about,
    type,
    private,
    city,
    state,
  })
  const groupImage = await newGroup.createGroupImage({ url: imageUrl })


  // add organizer membership to current user who's creating a group
  const currUser = await User.findByPk(req.user.id)
  const currUserMemInGroup = await currUser.createMembership({
    status: "organizer",
    groupId: newGroup.id
  })

  // console.log(currUserMemInGroup)
  res.status(201).json({
    id: newGroup.id,
    organizerId: newGroup.organizerId,
    name: newGroup.name,
    about: newGroup.about,
    type: newGroup.type,
    private: newGroup.private,
    city: newGroup.city,
    state: newGroup.state,
    imageUrl: groupImage.url,
    imageId: groupImage.id
  })
})


// Add an Image to a Group based on the Group's id
// Create and return a new image for a group specified by id.
// Require Authentication: true
// Require proper authorization: Current User must be the organizer for the group
router.post("/:id/images", requireAuth, handleError404, handleAddGroupImgErr403, validateImageOnCreate, async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id)
    const { url, preview } = req.body
    const newGroupImage = await group.createGroupImage(
      {
        url,
        preview
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
    res.status(200).json({
      id: newGroupVenues.id,
      groupId: req.params.id,
      address: newGroupVenues.address,
      city: newGroupVenues.city,
      state: newGroupVenues.state,
      lat: newGroupVenues.lat,
      lng: newGroupVenues.lng


    })



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
    // console.log(typeof price)
    //create new group event

    const newGroupEvent = await currGroup.createEvent({
      venueId, name, type, capacity, price, description, startDate, endDate
    })


    // //group organizer of an event automatically create new Attendance
    // const newAttendance = await Attendance.create({
    //   eventId: newGroupEvent.id,
    //   userId:req.user.id,
    //   status:"attending"
    // })
    //check if current user has membership in the group
    //if in the group - check status
    const newGroupEventObj = {
      id: newGroupEvent.id,
      groupId: parseInt(req.params.id),
      venueId: newGroupEvent.venueId,
      name: newGroupEvent.name,
      type: newGroupEvent.type,
      capacity: newGroupEvent.capacity,
      price: Number(newGroupEvent.price),
      description: newGroupEvent.description,
      startDate: new Date(newGroupEvent.startDate),
      endDate: new Date(newGroupEvent.endDate)
    }
    // console.log(newGroupEventObj)
    res.status(200).json(newGroupEventObj)


  } catch (err) {
    // console.log(err)
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
      memberId: req.user.id,
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

    // Check if the membership exists
    const membershipToUpdate = await currGroup.getMemberships({
      where: { userId: memberId }
    })
    // 404 If membership does not exist
    if (!membershipToUpdate.length) {
      return next({
        status: 404,
        message: "Membership between the user and the group does not exist"
      })

    } else {
      const membershipToUpdateObj = membershipToUpdate[0].toJSON()

      // authorization
      let currUserMembership = currUserMembershipInGroup[0].toJSON()
      // console.log(currUserMembership.status)
      let resObj
      if (currUserMembership.status === "organizer") {
        membershipToUpdate[0].status = status
        await membershipToUpdate[0].save()
        return res.json({
          id: membershipToUpdateObj.id,
          groupId: req.params.id,
          memberId: memberId,
          status: status
        })
      } else if (currUserMembership.status === "co-host") {
        if (status !== "co-host") {
          membershipToUpdate[0].status = status
          await membershipToUpdate[0].save()
          return res.json({
            id: membershipToUpdateObj.id,
            groupId: req.params.id,
            memberId: memberId,
            status: status
          })
        } else {
          return next({
            status: 403,
            message: "You do not have authorization to change the status to co-host"
          })
        }
      } else {
        return next({
          status: 403,
          message: "forbidden"
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
    const { name, about, type, private, city, state, imageUrl } = req.body
    // console.log(private)
    // find group by Id after id is provided and matched
    const groupToUpdate = await Group.findByPk(req.params.id)
    // find group images
    const groupImages = await groupToUpdate.getGroupImages({
      where: {
        preview: true
      }
    })
    groupImages[0].toJSON().url = imageUrl
    // console.log(previewImageUrl)
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
        return res.json({
          id: groupToUpdate.id,
          name: groupToUpdate.name,
          about: groupToUpdate.about,
          type: groupToUpdate.type,
          private: groupToUpdate.private,
          city: groupToUpdate.city,
          state: groupToUpdate.state,
          imageUrl: imageUrl
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
  } catch (err) {
    next(err);
  }
})



// Delete a membership to a group specified by id.
// Require Authentication: true
// Require proper authorization: Current User must be the host of the group, or the user whose membership is being deleted
router.delete("/:id/membership", requireAuth, handleError404, checkMemberDelInput, handleMemDelError404, handleDelMembership403, async (req, res, next) => {
  // const group = await Group.findByPk(req.params.id)
  const { memberId } = req.body
  // memberId is userId User PK
  const membershipToDel = await Membership.findOne({
    where: {
      userId: memberId,
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
router.delete("/:id", requireAuth, handleDelGroup403, async (req, res, next) => {
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