'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.hasMany(models.Event,{
        foreignKey: "venueId",
        onDelete: "cascade",
        hooks: true
      })
      Venue.belongsTo(models.Group,{
        foreignKey:"groupId"
      })
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Street address is required"
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "City is required"
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "State is required"
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: {
          msg: "Latitude is not valid"
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: {
          msg: "Longitude is not valid"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};