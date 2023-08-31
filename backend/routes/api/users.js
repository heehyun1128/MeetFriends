// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();


const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required')
    .custom((value)=>{
      if (value[0].toUpperCase() !== value[0]) {
        throw new Error("Firstname must be capitalized.")
      }
      if (/[0-9]/.test(value)){
        throw new Error("Firstname cannot include number.")
      }
      return true
    })
    ,
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required')
    .custom((value) => {
      if (value[0].toUpperCase() !== value[0]) {
        throw new Error("Lastname must be capitalized.")
      }
      if (/[0-9]/.test(value)) {
        throw new Error("Lastname cannot include number.")
      }
      return true
    })
    ,
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.')
    .custom(async (value) => {
      const user = await User.findOne({
        where: {
          email: value
        }
      })
      if (user) {
        throw new Error('User with that email already exists')
      }
    }),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.')
    .custom(async (value) => {
      const user = await User.findOne({
        where: {
          username:value
        }
      })
      if (user) {
        throw new Error('User with that username already exists')
      }
    })
    ,
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;

    //check if user already exists
    try {
      const userWithEmail = await User.findOne({
        where: {
          email
        }
      })
      // console.log(userWithEmail)
      const userWithUsername = await User.findOne({
        where: {
          username
        }
      })
      if (userWithEmail) {
        next({
          status: 500,
          message: "User already exists",
          errors: {
            "email": "User with that email already exists"
          }
        })
      }
      if (userWithUsername) {
        next({
          status: 500,
          message: "User already exists",
          errors: {
            "username": "User with that username already exists"
          }
        })
      }

      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, firstName, lastName, username, hashedPassword });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    } catch (err) {
      next(err)
    }


  }
);


module.exports = router;