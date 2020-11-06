const userInfo = require("../models/userInfo");
const { hash } = require("../utils/hash");

const userData = [
  {
    firstName: "Sathesh",
    lastName: "Narayanan",
    age: 23,
    gender: "Male",
    email: "sathesh@gmail.com",
    password: hash("sathesh")
  },
  {
    firstName: "Moses",
    lastName: "Stephen",
    age: 23,
    gender: "Male",
    email: "moses@gmail.com",
    password: hash("moses")
  }
];

const userSeeder = async () => {
  await userInfo.sync({ force: true });

  try {
    userData.forEach(async (element) => {
      const result = await userInfo.create(element);
      const { id } = result.get();
        console.log(id)
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = userSeeder;
