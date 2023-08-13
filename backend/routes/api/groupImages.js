const express = require('express');
// const cookieParser = require('cookie-parser');
const { requireAuth } = require("../../utils/auth")

const { Group, GroupImage, Membership, Attendance, User, Venue, sequelize } = require('../../db/models');

const { Op } = require('sequelize');


const router = express.Router();




const handleDelImgErr404 = async (req, res, next) => {
  const groupImgToDel = await GroupImage.findByPk(req.params.id)

  if (!groupImgToDel) {
    return next({
      status: 404,
      message: "Group Image couldn't be found"
    })
  }
  next()
}
const handleError403 = async (req, res, next) => {

  const groupImage = await GroupImage.findByPk(req.params.id)
  const groupId = groupImage.toJSON().groupId
  const currGroup = await Group.findByPk(groupId)

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
  // if (req.user.id !== group.organizerId && req.user.id !== userId) {
  //   return next({
  //     status: 403,
  //     message: "Only group organizer or co-host can delete the image"
  //   })

  // } else {
  //   next()
  // }
}

// Delete an existing image for a Group.
// Require Authentication: true
// Require proper authorization: Current user must be the organizer or "co-host" of the Group
router.delete("/:id", requireAuth, handleDelImgErr404, handleError403, async (req, res, next) => {
  const groupImgToDel = await GroupImage.findByPk(req.params.id)
  await groupImgToDel.destroy()
  res.json({
    "message": "Successfully deleted"
  })

})

module.exports = router;