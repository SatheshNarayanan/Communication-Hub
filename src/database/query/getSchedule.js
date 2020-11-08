const scheduleHeader = require("../models/scheduleHeader");

const getScheduleData = async (id) => {
  const result = await scheduleHeader.findAll({ where: { userid : id } });
  return JSON.parse(JSON.stringify(result));
};

module.exports = getScheduleData;
