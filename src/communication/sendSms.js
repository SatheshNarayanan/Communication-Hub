    const accountSid = process.env.ACCOUNTSID
    const authToken = process.env.AUTHTOKEN

const { response } = require("express");
    const sms = require("twilio");
    const client = sms(accountSid,authToken)

    const sendMessage = (to,subject,body) => {
        client.messages.create({
            to:to,
            from : process.env.MOBILE,
            body : subject +  " - " + body
        }).then((message) => {
            console.log(message.sid)
        }).catch((e)=> { console.log(e)})
    }
    module.exports = sendMessage
   