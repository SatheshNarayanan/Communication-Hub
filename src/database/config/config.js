const { Sequelize } = require("sequelize");

const userDB = new Sequelize(process.env.DB_HOST);

(async () => {
  try {
    await userDB.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = userDB;
