const svgCaptcha = require('svg-captcha');
const { consoleLevel } = require('egg-mock');
const BaseController = require('./base')
const fse = require('fs-extra')
const path = require('path')
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

  async mergefile(){
    const {ext, size, hash} = this.ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)

    await this.ctx.service.tools.mergeFile(filePath, hash, size)
    this.success({
      url:`/public/${hash}.${ext}`
    })
  }

  async checkfile(){
    const {ctx} = this
    const {ext, hash} = ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)

    let uploaded = false
    let uploadedList = []

    if(fse.existsSync(filePath)){
      uploaded = true
    }else{
      uploadedList = await this.getUploadedList(path.resolve(this.config.UPLOAD_DIR, hash))
    }
    this.success({
      uploaded, uploadedList
    })

  }

  async getUploadedList(dirPath){
    return fse.existsSync(dirPath)
          ? (await (await fse.readdir(dirPath)).filter(name=>name[0]!=='.')):[]
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

  async uploadfile(){
    if(Math.random()>0.3){
      //retry while failing
      return this.ctx.status = 500
    }

    const {ctx} = this
    const file = ctx.request.files[0]
    const {name, hash} = ctx.request.body

    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)
    //const filePath = path.resolve(this.config.UPLOAD_DIR, hash)

    if(!fse.existsSync(chunkPath)){
      await fse.mkdir(chunkPath)
    }
    await fse.move(file.filepath, `${chunkPath}/${name}`)


    this.message('upload success')
    //   {
    //     me
    //     url:`/public/${file.filename}`
    //   }
    // )

  }
}




module.exports = UtilController;
