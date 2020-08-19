const {Service} = require('egg')
const nodemailer = require('nodemailer')
const { consoleLevel } = require('egg-mock')

const userEmail = 'maoyubinabc@163.com'
const transporter = nodemailer.createTransport({
    service:"163",
    secureConnection: true,
    auth:{
        user:userEmail,
        pass:''
    }
})

class ToolService extends Service {
    async sendMail(email, subject, text, html){
        const mailOption = {
            from: userEmail,
            cc:userEmail,
            to:email,
            subject,
            text,
            html
        }

        try {
            await transporter.sendMail(mailOption)
            return true
        }catch(err){
            console.log('email error', err)
            return false
        }
    }
}

module.exports = ToolService