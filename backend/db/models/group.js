'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User,{
        as: "Organizer",
        foreignKey:"organizerId"
      })
      Group.hasMany(models.Event,{
        foreignKey: "groupId",
        onDelete: "cascade",
        hooks: true
      })
      Group.hasMany(models.Venue,{
        foreignKey: "groupId",
        onDelete: "cascade",
        hooks: true
      })
      Group.hasMany(models.Membership,{
        foreignKey: "groupId",
        onDelete: "cascade",
        hooks: true
      })
      Group.hasMany(models.GroupImage,{
        foreignKey: "groupId",
        onDelete: "cascade",
        hooks: true
      })
    }
  }
  Group.init({
    organizerId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: {
          args: [1, 60],
          msg: "Name cannot be empty and must be 60 characters or less"
        }

      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len:{
          args:[50, Infinity],
          msg: "About must be 50 characters or more"
        }
      }
    },
    type: {
      type: DataTypes.ENUM("Online", "In Person"),
      allowNull: false,
      validate:{
        isIn: {
          args: [['Online', 'In Person']],
          msg: "Type must be 'Online' or 'In Person'"
        }
      }
    },
    private: {
      type:DataTypes.BOOLEAN,
      validate:{
        isBoolean:{
          msg: "Private must be a boolean"
        },
        len:[4,5],
        notEmpty: {
          msg: "Private must be a boolean"
        }

      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: {
          msg: "City is required"
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "State is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};