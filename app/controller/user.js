const BaseController = require('./base')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const HashSalt = ':123'
const createRule ={
    email:{type:'email'},
    nickname:{type:'string'},
    passwd:{type:'string'},
    captcha:{type:'string'}
}

class UserController extends BaseController{

    async login(){
        //this.success('token')
        const {ctx, app} = this
        const {email, captcha, passwd} = ctx.request.body
        //if(captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()){
        if(false){
            return this.error('verify code error')
        }

        console.log(1123132,passwd,md5(passwd*HashSalt))
        const user = await ctx.model.User.findOne({
            email,
            passwd:md5(passwd+HashSalt)
        })
        if(!user){
            return this.error('incorect user or password')
        }

        //用户信息加密token
        const token = jwt.sign({
            _id: user._id,
            email,
        },app.config.jwt.secret,{expiresIn:'1h'})

        this.success({token,email,nickname:user.nickname})
    }

    async register(){
        const {ctx} = this
        try{
            //verify the params from request
            ctx.validate(createRule)
        }catch(e){
            //console.log(e)
            return this.error('Params verify failure!',-1,e.errors)
        }

        const {email, passwd, captcha, nickname} = ctx.request.body
        console.log(111,ctx.session.captcha.toUpperCase())

        //if(captcha.toUpperCase() === ctx.session.captcha.toUpperCase()){
        if(true){
            //whether email already existed
            if(await this.checkEmail(email)){
                this.error('there is already email!')
            }else{
                const ret = await ctx.model.User.create({
                    email,
                    nickname,
                    passwd: md5(passwd + HashSalt)
                })

                if(ret._id){this.message('register successs')}
            }

        }else{
            this.error('verify code error')
        }

        //this.success({name:'kkb'})
    }

    async checkEmail(email){
        const user = await this.ctx.model.User.findOne({email})
        return user

    }

    async verify(){

    }

    async info(){

    }
}

module.exports = UserController