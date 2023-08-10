const express = require('express');
// const cookieParser = require('cookie-parser');
const { requireAuth } = require("../../utils/auth")

const { Group, Venue, EventImage, User, Membership, Attendance, sequelize, Event } = require('../../db/models');

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
  for (let i = 0; i < currAttendanceList.length; i++) {
    if (currAttendanceList[i].Attendance.userId === req.user.id) {
      next()
    }
  }

  // check if current user is organizer of group
  if (currEventGroup.organizerId !== req.user.id) {
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


// Get all Events
// Returns all the events.
// Require Authentication: false
router.get("/", async (req, res, next) => {
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
      }]
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
    if(eventImages.length){
      const eventImageUrl = eventImages[0].url
      event.previewImage = eventImageUrl
    }

    allEventsArr.push(event)
  }
  res.json({ Events: allEventsArr })
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
    console.log(err instanceof ValidationError)
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

  res.status(200).json({
    id: eventImage.id,
    url: eventImage.url,
    preview: eventImage.preview,
  })
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

    const currUserMembershipArr = groupOfEvent.Memberships
    const updateEventFn = () => {
      eventToEdit.venueId = venueId
      eventToEdit.name = name
      eventToEdit.type = type
      eventToEdit.capacity = capacity
      eventToEdit.price = price
      eventToEdit.description = description
      eventToEdit.startDate = startDate
      eventToEdit.endDate = endDate

    }


    res.json(eventToEdit)

  } catch (err) {
    next(err)
  }


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