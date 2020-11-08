const scheduleHeader = require("../models/scheduleHeader");

const scheduleData = [
  {
    schedulename: "moses_sch_1",
    status: "Active",
    repeat: "everyDay",
    time: "12:00 PM",
    userid: 2
  },
  {
    schedulename: "moses_sch_2",
    status: "Active",
    repeat: "everyMinute",
    time: "12:00 PM",
    userid: 2
  }
];

const scheduleSeeder = async () => {
  await scheduleHeader.sync({ force: true });

  try {
    scheduleData.forEach(async (element) => {
      const result = await scheduleHeader.create(element);
      const { id } = result.get();
        console.log(id)
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = scheduleSeeder;
