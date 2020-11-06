const cron = require("node-cron")

//schedule task that runs every minute
const task = cron.schedule("*/1 * * * *",() => {
    console.log("task scheduled")
},{
    scheduled : true
})