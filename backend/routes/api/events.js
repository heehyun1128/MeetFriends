const express = require('express');
// const cookieParser = require('cookie-parser');
const { requireAuth } = require("../../utils/auth")

const { Group, Venue, EventImage, User, Attendance, sequelize, Event } = require('../../db/models');

const { Op } = require('sequelize');

const router = express.Router();



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
    const eventImageUrl = eventImages[0].url
    event.previewImage = eventImageUrl

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

module.exports = router;