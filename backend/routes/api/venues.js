const express = require('express');
// const cookieParser = require('cookie-parser');
const { requireAuth } = require("../../utils/auth")

const { Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');

const { Op } = require('sequelize');

const router = express.Router();


// Edit a Venue specified by its id
// Edit a new venue specified by its id
// Require Authentication: true
// Require Authentication: Current User must be the organizer of the group or a member of the group with a status of "co-host"
router.put("/:id", requireAuth, async (req, res, next) => {

  try{
    const { address, city, state, lat, lng } = req.body
    const venueToEdit = await Venue.findByPk(req.params.id,{
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
    })
    if (!venueToEdit) {
      next({
        status: 404,
        title: "404 Not Found",
        message: `Venue ${req.params.id} couldn't be found`,
      })
    } else {
      const groupOfVenue = await venueToEdit.getGroup({
        
        include: {
          model: Membership,
          where: {
            userId: req.user.id
          },
          required: false
        }
      })
      
      const currUserMembershipArr = groupOfVenue.Memberships
      const updateVenueFn = ()=>{
        venueToEdit.address = address
        venueToEdit.city = city
        venueToEdit.state = state
        venueToEdit.lat = lat
        venueToEdit.lng = lng
        
      }
      if (groupOfVenue.organizerId === req.user.id) {
        updateVenueFn()
        await venueToEdit.save()
        return res.json(venueToEdit)
      }else if (currUserMembershipArr.length > 0) {
        const currUserMembership = currUserMembershipArr[0].toJSON()
        if (currUserMembership.status === "co-host") {
          updateVenueFn()
          await venueToEdit.save()
          return res.json(venueToEdit)
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
      console.log(groupMemberships)
      res.json(groupOfVenue)

    }
  } catch (err) {
    next(err)
  }


})




module.exports = router;