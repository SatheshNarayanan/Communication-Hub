const scheduleDetail = require("../models/scheduleDetail");

const scheduleDetailData = [
  {
    scheduleid: 1,
    sendVia: "SMS",
    dataSource: "Edit here",
    To: "+918300040510",
    connectionString: '',
    query : '',
    subject : "This is a saved template",
    body : "This is a saved template of direct editing...."
  },
  {
    scheduleid: 2,
    sendVia: "SMS",
    dataSource: "RDBMS",
    To: "",
    connectionString: "postgres://mujcokzf:ty8TtwMBdl929W-KnYvzJ-UlbEUmyYqo@lallah.db.elephantsql.com:5432/mujcokzf",
    query : 'select * from customers;',
    subject : " {%name%} -- from saved template",
    body : "This is a scheduled task for RDBMS saved template {%name%} - {%balance%}..."
  }
];

const scheduleDetilSeeder = async () => {
  await scheduleDetail.sync({ force: true });

  try {
    scheduleDetailData.forEach(async (element) => {
      const result = await scheduleDetail.create(element);
      const { id } = result.get();
        console.log(id)
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = scheduleDetilSeeder;
