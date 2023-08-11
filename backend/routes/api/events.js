const express = require('express');
// const cookieParser = require('cookie-parser');
const { requireAuth } = require("../../utils/auth")

const { Group, Venue, EventImage, User, Membership, Attendance, sequelize, Event } = require('../../db/models');

const { Op } = require('sequelize');

const router = express.Router();

const { query } = require('express-validator');
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


const attendValidation = [
  check('userId')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("userId must be provided"),
  check('status')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("status must be provided")
    .isIn(["attending", "waitlist", "pending"])
    .withMessage("Membership status must be attending, waitlist, or pending ")
    .custom(async (value, { req }) => {
      if (value === "pending") {
        throw new Error("Cannot change an attendance status to pending")
      }
    }),
  handleValidationErrors
]


const validateQueryParams = [
  query('page')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  query('size')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  query('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isString()
    .withMessage("Name must be a string"),
  query('type')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isIn(["Online", "In Person"])
    .withMessage("Type must be 'Online' or 'In Person'"),
  query('startDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Start date must be a valid datetime")
  ,
  handleValidationErrors
]


const handleError404 = async (req, res, next) => {
  const currEvent = await Event.findByPk(req.params.id)

  if (!currEvent) {
    next({
      status: 404,
      title: "404 Not Found",
      message: `Event ${req.params.id} couldn't be found`,
    })
  }
  next()
}

// handle 404 attendance to delete not exist
const attendanceDelError404 = async (req, res, next) => {
  const { userId } = req.body
  if (!userId) {
    return next({
      status: 400,
      message: "Please provide userId"
    })
  }
  const attendanceToDel = await Attendance.findOne({
    where: {
      userId,
      eventId: req.params.id
    }
  })

  if (!attendanceToDel) {
    return next({
      status: 404,
      message: "Attendance does not exist for this User"
    })
  }
  next()
}

//handle authorization
// 403 error
const handleError403 = async (req, res, next) => {
  const eventToEdit = await Event.findByPk(req.params.id)
  const groupOfEvent = await eventToEdit.getGroup({
    include: {
      model: Membership,
      where: {
        userId: req.user.id
      },
      required: false
    }
  })
  const currUserMembershipArr = groupOfEvent.Memberships
  if (groupOfEvent.organizerId !== req.user.id) {
    if (currUserMembershipArr.length > 0) {
      const currUserMembership = currUserMembershipArr[0].toJSON()
      if (currUserMembership.status !== "co-host") {
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


const handlePostImage403 = async (req, res, next) => {
  const currEvent = await Event.findByPk(req.params.id)
  //get all event attendees
  const currAttendanceList = await currEvent.getUsers({
    through: {
      model: Attendance,
      where: {
        status: "attending"
      }
    }
  })
  const currEventGroup = await currEvent.getGroup()
  const currUserMembershipInGroupArr = await currEventGroup.getMemberships({
    where: {
      userId: req.user.id
    }
  })

  // check if current user is attending
  let isAttending = false;
  for (let i = 0; i < currAttendanceList.length; i++) {
    if (currAttendanceList[i].Attendance.userId === req.user.id) {
      isAttending = true;
      break;

    }
  }

  // check if current user is organizer of group & if current user is attending
  if (currEventGroup.organizerId !== req.user.id && !isAttending) {
    if (currUserMembershipInGroupArr.length > 0) {
      const currUserMembershipInGroup = currUserMembershipInGroupArr[0].toJSON()
      // check if current user is co-host of group
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


//handle 403 delete attendance
// Current User must be the host of the group, or the user whose membership is being deleted
const handleDelMembership403 = async (req, res, next) => {
  const event = await Event.findByPk(req.params.id)
  const groupId = event.toJSON().groupId
  const group = await Group.findByPk(groupId)
  const { userId } = req.body


  if (req.user.id !== group.organizerId && req.user.id !== userId) {
    return next({
      status: 403,
      message: "Only the User or organizer may delete an Attendance"
    })

  } else {
    next()
  }

}


// Get all Events
// Returns all the events.
// Require Authentication: false

router.get("/", validateQueryParams, async (req, res, next) => {
  // Add Query Filters to Get All Events
  // test:/events?page=0&size=5&name=Event 1&type=In Person&startDate=2023-12-10 14:00:00
  let { page, size, name, type, startDate } = req.query;

  page = (page === undefined) ? 1 : parseInt(page);
  size = (size === undefined) ? 20 : parseInt(size);
  if (page > 10) {
    page = 10
  }
  if (size > 20) {
    size = 20
  }
  const pagination = {};
  if (page >= 1 && size >= 1) {
    pagination.limit = size;
    pagination.offset = size * (page - 1);
  }
  name = req.query.name || null
  type = req.query.type || null
  startDate = req.query.startDate || null

  const where = {}
  if (name) {
    where.name = name
  }
  if (type) {
    where.type = type
  }
  if (startDate) {
    where.startDate = startDate
  }

  const allEvents = await Event.findAll({
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
      }],
    where,
    ...pagination
  })

  // numAttending:
  let allEventsArr = []
  for (let i = 0; i < allEvents.length; i++) {
    let event = allEvents[i]

    const eventAttendances = await event.getUsers({
      through: {
        model: Attendance,
        where: {
          status: "attending"
        }
      }
    })
    // previewImage
    const eventImages = await event.getEventImages({
      where: {
        preview: true
      }
    })
    event = event.toJSON()
    event.numAttending = eventAttendances.length
    if (eventImages.length) {
      const eventImageUrl = eventImages[0].url
      event.previewImage = eventImageUrl
    }

    allEventsArr.push(event)
  }
  res.json({ Events: allEventsArr })
})


// Get all Attendees of an Event specified by its id
// Returns the attendees of an event specified by its id.
// Require Authentication: false
router.get("/:id/attendees", handleError404, async (req, res, next) => {
  const currEvent = await Event.findByPk(req.params.id)
  const allAttendees = await currEvent.getUsers({
    attributes: ["id", "firstName", "lastName"],

  })

  const allAttendeeArr = []
  const nonPendingAttendeeArr = []
  for (let i = 0; i < allAttendees.length; i++) {
    const attendee = allAttendees[i]
    const attendeeObj = {
      id: attendee.id,
      firstName: attendee.firstName,
      lastName: attendee.lastName,
      Attendance: {
        status: attendee.Attendance.status
      }
    }
    allAttendeeArr.push(attendeeObj)

    if (attendee.toJSON().Attendance.status !== "pending") {
      nonPendingAttendeeArr.push(attendee.toJSON())
    }
    console.log(currEvent.toJSON())

  }

  let currUserMemStatus = await Membership.findOne({
    where: {
      userId: req.user.id,
      groupId: currEvent.toJSON().groupId
    }
  })
  if (currUserMemStatus) {
    currUserMemStatus = currUserMemStatus.toJSON()
    if (currUserMemStatus.status === "co-host" || currUserMemStatus.status === "organizer") {
      res.json({ Attendees: allAttendeeArr })
    } else {
      res.json({ Attendees: nonPendingAttendeeArr })
    }
  } else {
    res.json({ Attendees: nonPendingAttendeeArr })
  }


})



// Get details of an Event specified by its id
// Returns the details of an event specified by its id.
// Require Authentication: false
router.get("/:id", async (req, res, next) => {
  try {
    let event = await Event.findByPk(req.params.id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      include: [{
        model: Group,
        attributes: ["id", "name", "private", "city", "state"]
      }, {
        model: Venue,
        attributes: ["id", "address", "city", "state", "lat", "lng"]
      }, {
        model: EventImage,
        attributes: ["id", "url", "preview"]
      }]
    })
    if (!event) {
      next({
        status: 404,
        title: "404 Not Found",
        message: `Group ${req.params.id} couldn't be found`,
      })
    } else {
      // numAttending:
      const eventAttendances = await event.getUsers({
        through: {
          model: Attendance,
          where: {
            status: "attending"
          }
        }
      })
      event = event.toJSON()
      event.numAttending = eventAttendances.length
      res.json(event)
    }
  } catch (err) {
    // console.log(err instanceof ValidationError)
    next(err)
  }
})


// Add an Image to a Event based on the Event's id
// Create and return a new image for an event specified by id.
// Require Authentication: true
// Require proper authorization: Current User must be an attendee, host, or co - host of the event
router.post("/:id/images", requireAuth, handleError404, handlePostImage403, validateImageOnCreate, async (req, res, next) => {

  const currEvent = await Event.findByPk(req.params.id)
  const { url, preview } = req.body

  const eventImage = await currEvent.createEventImage({ url, preview })
  console.log(eventImage.toJSON())
  console.log("Before sending response");
  res.status(200).json({
    id: eventImage.toJSON().id,
    url: eventImage.toJSON().url,
    preview: eventImage.toJSON().preview,

  })

})

// Request attendance for an event specified by id.
// Require Authentication: true
// Require Authorization: Current User must be a member of the group
router.post("/:id/attendance", requireAuth, handleError404, async (req, res, next) => {
  const currEvent = await Event.findByPk(req.params.id, {
    include: { model: Group }
  })
  // check if current User already has a pending attendance for the event
  const currUserMemStatus = await Membership.findOne({
    userId: req.user.id,
    groupId: currEvent.toJSON().Group.id
  })
  //  Require Authorization: Current User must be a member of the group
  if (currUserMemStatus.toJSON().status === "pending") {
    return next({
      status: 403,
      message: "Please join the event group before signing up for the event",
    })
  }

  const userCurrAttendance = await Attendance.findOne({
    where: {
      userId: req.user.id,
      eventId: req.params.id
    }
  })

  if (userCurrAttendance) {
    if (userCurrAttendance.toJSON().status === "pending" || userCurrAttendance.toJSON().status === "waitlist") {
      return next({
        status: 400,
        message: "Attendance has already been requested"
      })
    } else if (userCurrAttendance.toJSON().status === "attending") {
      return next({
        status: 400,
        message: "User is already an attendee of the event"
      })
    }
  } else {
    const newAttendee = await Attendance.create({
      eventId: req.params.id,
      userId: req.user.id,
      status: "pending"
    })
    res.json({
      userId: req.user.id,
      status: "pending"
    })
  }



})


// Change the status of an attendance for an event specified by id.
// Require Authentication: true
// Require proper authorization: Current User must already be the organizer or have a membership to the group with the status of "co-host"
router.put("/:id/attendance", requireAuth, handleError404, handleError403, attendValidation, async (req, res, next) => {
  const { userId, status } = req.body
  const attendancetoUpdate = await Attendance.findOne({
    attributes: ["id", "eventId", "userId", "status"],
    where: {
      eventId: req.params.id,
      userId
    }
  })

  if (!attendancetoUpdate) {
    return next({
      status: 404,
      message: "Attendance between the user and the event does not exist"
    })
  } else {
    if (attendancetoUpdate.status !== status) {
      attendancetoUpdate.status = status
      await attendancetoUpdate.save()

      res.json(attendancetoUpdate)
    } else {
      return next({
        status: 404,
        message: `The user is already in ${status} status`
      })
    }

  }
})



// Edit an Event specified by its id
// Edit and returns an event specified by its id
// Require Authentication: true
// Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.put("/:id", requireAuth, handleError404, handleError403, validateEventInfoOnCreate, async (req, res, next) => {

  try {
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
    const eventToEdit = await Event.findByPk(req.params.id)

    const groupOfEvent = await eventToEdit.getGroup({
      include: {
        model: Membership,
        where: {
          userId: req.user.id
        },
        required: false
      }
    })



    eventToEdit.venueId = venueId
    eventToEdit.name = name
    eventToEdit.type = type
    eventToEdit.capacity = capacity
    eventToEdit.price = price
    eventToEdit.description = description
    eventToEdit.startDate = startDate
    eventToEdit.endDate = endDate
    await eventToEdit.save()



    res.json(eventToEdit)

  } catch (err) {
    next(err)
  }


})



// Delete attendance to an event specified by id
// Require Authentication: true
// Require proper authorization: Current User must be the host of the group, or the user whose attendance is being deleted

router.delete("/:id/attendance", requireAuth, handleError404, attendanceDelError404, handleDelMembership403, async (req, res, next) => {
  const { userId } = req.body

  const attendanceToDel = await Attendance.findOne({
    where: {
      userId,
      eventId: req.params.id
    }
  })
  await attendanceToDel.destroy()
  res.status(200).json({
    message: "Successfully deleted attendance from event"
  })
})




// Delete an Event specified by its id
// Require Authentication: true
// Require Authorization: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.delete("/:id", requireAuth, handleError404, handleError403, async (req, res, next) => {
  const eventToDel = await Event.findByPk(req.params.id)
  await eventToDel.destroy()
  res.status(200).json({
    message: "Successfully deleted"
  })
})

module.exports = router;