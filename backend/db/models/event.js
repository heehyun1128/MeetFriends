'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
        onDelete: "cascade",
        hooks: true
      })
      Event.belongsToMany(models.User,{
        through:models.Attendance,
        foreignKey: "eventId",
        otherKey: "userId"
      })
      Event.belongsTo(models.Group,{
        foreignKey:"groupId"
      })
      Event.belongsTo(models.Venue,{
        foreignKey:"venueId"
      })
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        minLen(name) {
          if (name.length < 5) {
            throw new Error('Name must be at least 5 characters');
          }
        },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required"
        }
      }
    },
    type: {
      type: DataTypes.ENUM("Online", "In Person"),
      allowNull: false,
      validate: {
        // isValidType(type){
        //   if (type !== "Online" && type !== "In Person" ){
        //     throw new Error("Type must be 'Online' or 'In person'")
        //   }
        // }
        isIn: {
          args: [['Online', 'In Person']],
          msg: "Type must be 'Online' or 'In person'"
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "Capacity must be an integer"
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      
    },
    startDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          args:true,
          msg: "Start date must be a valid datetime"
      },  
        isFutureDate(value) {
          if (new Date(value) <= new Date()) {
            throw new Error('Start date must be in the future');
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      isDate: {
        args: true,
        msg: "End date must be a valid datetime"
      },  
      validate: {
        isLessThanStartDate(value) {
          if (new Date(value) <= new Date(this.startDate)) {
            throw new Error('End date is less than start date');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};