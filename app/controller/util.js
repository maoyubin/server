const svgCaptcha = require('svg-captcha');
const { consoleLevel } = require('egg-mock');
const BaseController = require('./base')
class UtilController extends BaseController {
  async captcha() {
      const captcha = svgCaptcha.create(
        {
          size: 4,
          fontSize: 50,
          width: 100,
          height: 40,
          noise: 3
        }
      )
      //console.log(captcha.text)
      this.ctx.session.captcha = captcha.text
      this.ctx.response.type='image/svg+xml'
      this.ctx.body = captcha.data

  }

  async sendcode(){
    const {ctx} = this
    const email = ctx.query.email
    let code = Math.random().toString().slice(2,6)
    console.log('email='+email+',verifyCode ='+code)
    ctx.session.emailcode = code

    const subject = '开课吧验证码'
    const text= ''
    const html =`<h2>小开社区</h2><a href="https://kaikeba.com"><span>${code}</span></a>`

    const hasSend = await this.service.tools.sendMail(email,subject,text,html)

    if(hasSend){
      this.message('send email success')
    }else{
      this.error('send email error !!!')
    }
  }
}

module.exports = UtilController;
