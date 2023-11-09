const mailer = require('nodemailer')

const send = mailer.createTransport({
    // service: "gmail",
    // auth: {
    //     user: "bhav63023@gmail.com",
    //     pass: "zomato@123" , 
        
    // }

    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "724fa1ef9a8fee",
      pass: "4787f256dc91a2"
    }
//   });
})

const options = {
    from: 'muskan.kapahi@grazitti.com',
    to: 'muskankapahi123@gmail.com',
    subject: 'Meeting Reminder',
    html: '<p>hi your meeting in just 15 min</p>'
};

module.exports = { send , options}