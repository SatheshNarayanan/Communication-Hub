//dotenv for setting up envitonmental variables
const path = require("path")
require("dotenv").config({
    path : path.join(__dirname,"../.env")
})
const express = require("express");
//server side templating engine
const expressHBS = require("express-handlebars");
const ifEquality = require("./views/helpers/ifEquality");
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
const {sign, verify} = require("./database/utils/jwtService")
//Seeder functions for seeding dummy data
const userSeeder = require("./database/seeder/userSeeder")
const customerSeeder = require("./database/seeder/customerSeeder")
const scheduleSeeder = require("./database/seeder/scheHeadSeeder")
const scheduleDetilSeeder = require("./database/seeder/scheDetailSeeder")
const scheduleDetail = require("./database/models/scheduleDetail")
const scheduleHeader = require("./database/models/scheduleHeader")
//middlewares
const auth = require("./middlewares/auth");
const getScheduleData = require("./database/query/getSchedule");
const getScheduleDetailData = require("./database/query/getScheduleDetail");
const userDB = require("./database/config/config");
//const taskCheck = require("./schedule/Job")

const app = express();

// userSeeder();
// customerSeeder();
 //scheduleSeeder();
//scheduleDetilSeeder();
//taskCheck.start();
app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//setting up templating engine
const hbs = expressHBS.create({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "./views/layouts"),
    partialsDir: path.join(__dirname, "./views/partials"),
    helpers: {
      ifEquality
    }
  });
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

//login page rendering
app.get("/", (request, response) => {
    response.status(200).render("login.hbs", {
      layout: "hero.hbs",
      title: "Login",
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
              sub: result[0].firstName,
              email
            });
            console.log(verify(token))
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
      title: "Form",
      action: "/user",
      method: "POST",
      data : { datasource : "Edit here"}
    });
  });

  app.get("/schedule",auth, async (request, response) => {
    const {email} = verify(request.cookies.jwt)
    const result = await getUser(email);
    const { id } = result[0]
    const data = await getScheduleData(id)
    response.status(200).render("schedule.hbs", {
      layout: "hero.hbs",
      title: "Schedule",
      action: "/user",
      method: "POST",
      data : data
    });
  });

  app.post("/saveSchedule",auth, async (request, response) => {
      const { hiddenSchedule } = request.body
      const {email} = verify(request.cookies.jwt)
      const result = await getUser(email);
      let { id, firstName } = result[0]
       try {
        const data = await userDB.query(`select max(id) from schedule_infos where userid = ${id}`, { type: QueryTypes.SELECT })
              let max = data[0].max === null ? 1 : (data[0].max+1)
              delete request.body.template
              if ( hiddenSchedule === ""){
                  const headerData =  {
                          schedulename: `${firstName}_sch_${max}`,
                          status: "disabled",
                          repeat: "everyDay",
                          time: "12:00 PM",
                          userid: id
                        }
                        const headerInsert = await scheduleHeader.create(headerData);
                        const {id : scheduleid} = headerInsert
                        const detailData = { ...request.body,scheduleid }
                        console.log(detailData)
                        const detailInsert = await scheduleDetail.create(detailData);
                        console.log(headerInsert.get(),detailInsert.get())
              } else {
                    const detailInsert = await scheduleDetail.update({ ...request.body,scheduleid : hiddenSchedule }, { where: { scheduleid: hiddenSchedule } });
                    console.log(detailInsert)
              }
              response.status(200).send({"message":"Date inserted or updated successfully"})
      } catch (e) {
        console.log(e)
        response.status(400).send({"message": "Cannot insert or update"})
      }
     
  });

  app.get("/editschedule/:id",auth, async (request, response) => {
    const { id } = request.params
    const data = await getScheduleDetailData(id)
    console.log(data)
    response.status(200).render("form.hbs", {
      layout: "hero.hbs",
      title: "Edit Schedule",
      action: "/user",
      method: "POST",
      data : data[0]
    });
  });
  
  
  app.post("/user", async (request, response) => {
    try{
    let { sendVia, dataSource,To, connectionString, query, subject, body} = request.body
    console.log(request.body)
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

