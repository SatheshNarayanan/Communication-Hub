//dotenv for setting up envitonmental variables
const path = require("path")
require("dotenv").config({
    path : path.join(__dirname,"../.env")
})
const express = require("express");
//server side templating engine
const expressHBS = require("express-handlebars");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
//An ORM for secure connection with psql 
const { Sequelize,QueryTypes } = require('sequelize');
const getUser = require("./database/query/getUser")
//functions for sending mail and sms
const sendMessage = require("./communication/sendSms")
const sendMails = require("./communication/sendMail")
//Login verification and authentication
const {compareHash} = require("./database/utils/hash")
const {sign} = require("./database/utils/jwtService")
//Seeder functions for seeding dummy data
const userSeeder = require("./database/seeder/userSeeder")
const customerSeeder = require("./database/seeder/customerSeeder")
//middlewares
const auth = require("./middlewares/auth")

const app = express();

//userSeeder();
//customerSeeder();
app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//setting up templating engine
const hbs = expressHBS.create({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "./views/layouts"),
    partialsDir: path.join(__dirname, "./views/partials")
  });
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

//login page rendering
app.get("/", (request, response) => {
    response.status(200).render("login.hbs", {
      layout: "hero.hbs",
      title: "Home",
      action: "/login",
      method: "POST"
    });
  });

//login authorisation API
app.post("/login", async  (request, response) => {
    try {
        const { email, password } = request.body;
        const result = await getUser(email);
        if (result) {
          const isValidPassword = compareHash(password, result[0].password);
          if (isValidPassword) {
            const token = sign({
              sub: "user",
              email
            });
            response.cookie("jwt", token, { httpOnly: true });
            response.status(200).json({
              message: "Valid user!!"
            });
          } else {
            response.status(400).send("Invalid User");
          }
        } else {
          response.status(400).send("Invalid User");
        }
      } catch (e) {
          console.log(e)
        response.status(400).send(e);
      }
  });

//form for getting data 
app.get("/form",auth, (request, response) => {
    response.status(200).render("form.hbs", {
      layout: "hero.hbs",
      title: "Home",
      action: "/user",
      method: "POST"
    });
  });
  
  app.post("/user", async (request, response) => {
    try{
    let { sendVia, dataSource,To, connectionString, query, subject, body} = request.body
    //Logic of static mail or sms sending
    if (dataSource === "Edit here") {
    let phone = ''
    console.log(request.body.To)
    if (sendVia === "SMS")
    {
        phone = request.body.To.split(";")
        phone.forEach( async element => {
            await sendMessage(element,subject,body)
        })
    } else {
        await sendMails(To,subject,body)
    }
    } else {
     //logic of dynamic mail or sms sending 
        const customerDB= new Sequelize(connectionString);
        const data = await customerDB.query(query, { type: QueryTypes.SELECT })
        data.forEach( async element => {
        let dataToBeSent = body, dataSubject = subject
            const keys = Object.keys(element)
            keys.forEach (innerelement => {
                dataToBeSent =  dataToBeSent.replace(`{%${innerelement}%}`,element[innerelement])
                dataSubject =  dataSubject.replace(`{%${innerelement}%}`,element[innerelement])
            })
        if (element.type === "sms"){
            await sendMessage(element.send,dataSubject,dataToBeSent)
        }else {
            await sendMails(element.send,dataSubject,dataToBeSent)
        }
        })  
    }
    response.status(200).send({ message : "Successfully sent"})
    }
    catch (e){
        console.log(e)
        response.status(400).send({message : "There is some error"})
    }
  });

//logout
app.get("/logout", (request, response) => {
    response.clearCookie("jwt");
    response.redirect("/");
  });


app.listen( process.env.PORT || 8080, () => {
    console.log("app is running!!!")
})

