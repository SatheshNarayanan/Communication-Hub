const scheduleDetail = require("../models/scheduleDetail");

const getScheduleDetailData = async (id) => {
  const result = await scheduleDetail.findAll({ where: { scheduleid : id } });
  return JSON.parse(JSON.stringify(result));
};

module.exports = getScheduleDetailData;
