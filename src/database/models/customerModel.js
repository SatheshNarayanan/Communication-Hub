const { DataTypes } = require("sequelize");
const userDB = require("../config/config");

const customerInfo = userDB.define("customers", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "name"
  },
  send: {
    type: DataTypes.STRING,
    field: "send"
  },
  balance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = customerInfo;
