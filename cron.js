const cron = require('node-cron')
const {
    send,
    options
} = require('./mail')

const Schedule =  cron.schedule('*/5 * * * *', () => {
        console.log("Mail Sent")
        send.sendMail(options, (err, info) => {
            if (err)
                console.log(err);
            else
                console.log(info);
        });
    })


module.exports = { Schedule }