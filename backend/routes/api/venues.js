const express = require('express');
// const cookieParser = require('cookie-parser');
const { requireAuth } = require("../../utils/auth")

const { Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');

const { Op } = require('sequelize');

const router = express.Router();






module.exports = router;