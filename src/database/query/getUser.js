const userData = require("../models/userInfo");

const getUserData = async (email) => {
  const result = await userData.findAll({ where: { email } });
  return JSON.parse(JSON.stringify(result));
};

module.exports = getUserData;
