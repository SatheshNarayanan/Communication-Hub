const { DataTypes } = require("sequelize");
const userDB = require("../config/config");

const schdeuleDetails = userDB.define("schedule_details", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  scheduleid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "scheduleid"
  },
  sendVia: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "sendvia"
  },
  dataSource: {
    type: DataTypes.STRING,
    field: "datasource"
  },
  To: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "to"
  },
  connectionString: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "connectionstring"
  },
  query: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "query"
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "subject"
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "body"
  },
});

module.exports = schdeuleDetails;
