const { DataTypes } = require("sequelize");
const userDB = require("../config/config");

const scheduleHeader = userDB.define("schedule_infos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  schedulename: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "schedulename"
  },
  status: {
    type: DataTypes.STRING,
    field: "status"
  },
  repeat: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "repeat"
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "time"
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "userid"
  }
});

module.exports = scheduleHeader;
