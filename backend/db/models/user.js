'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.belongsToMany(models.Event, {
        through: models.Attendance,
        foreignKey: "userId",
        otherKey: "eventId"
      })
      User.hasMany(models.Group, {
        foreignKey: "organizerId",
        onDelete: "cascade",
        hooks: true
      })
      User.hasMany(models.Membership, {
        foreignKey: "userId",
        onDelete: "cascade",
        hooks: true
      })
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   notEmpty: {
        //     msg: "First Name is required"
        //   },
          // isCapitalized(firstName) {
          //   if (firstName[0].toUpperCase() !== firstName[0]) {
          //     throw new Error("Firstname must be capitalized.")
          //   }
          // }
        // }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   notEmpty: {
        //     msg: "Last Name is required"
        //   },
          // isCapitalized(lastName) {
          //   if (lastName[0].toUpperCase() !== lastName[0]) {
          //     throw new Error("Lastname must be capitalized.")
          //   }
          // }
        // }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: {
            args: true,
            msg: "Invalid email"
          }
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  }
  );
  return User;
};
