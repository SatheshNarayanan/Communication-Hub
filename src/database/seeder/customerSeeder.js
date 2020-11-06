const customerInfo = require("../models/customerModel");

const customerData = [
    {
      name: "Sathesh",
      send: "satheshnarayanann@gmail.com",
      balance: 2300,
      type : "email"
    },
    {
    name: "Ajay",
    send: "satheshnarayanann@gmail.com",
    balance: 13000,
    type : "email"
    },
    {
        name: "Mosa",
        send: "+918300040510",
        balance: 2300,
        type : "sms"
      },
      {
      name: "Ajay",
      send: "+918760755431",
      balance: 13000,
      type : "sms"
      }
  ];
  
  const customerSeeder = async () => {
    await customerInfo.sync({ force: true });
  
    try {
        customerData.forEach(async (element) => {
        const result = await customerInfo.create(element);
        const { id } = result.get();
          console.log(id)
      });
    } catch (e) {
      console.error(e);
    }
  };
  
  module.exports = customerSeeder;