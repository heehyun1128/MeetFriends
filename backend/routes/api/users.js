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
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
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
  async (req, res,next) => {
    const { email, password, username, firstName, lastName } = req.body;

    //check if user already exists
    try {
      const userWithEmail = await User.findOne({
        where: {
          email
        }
      })
      const userWithUsername = await User.findOne({
        where: {
          username
        }
      })
      if (userWithEmail) {
        const error = new Error()
        error.status = 500
        error.message = "User already exists"
        error.errors = {
          email: "User with that email already exists"
        }
      }
      if (userWithUsername) {
        const error = new Error()
        error.status = 500
        error.message = "User already exists"
        error.errors = {
          email: "User with that username already exists"
        }
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
    } catch (error) {
      next(error)
    }


  }
);


module.exports = router;