const {Service} = require('egg')
const nodemailer = require('nodemailer')
const { consoleLevel } = require('egg-mock')
const fse = require('fs-extra')
const path = require('path')
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

    async mergeFile(filePath, filehash, size){
        const chunkDir = path.resolve(this.config.UPLOAD_DIR,filehash)

        let chunks = await fse.readdir(chunkDir)

        console.log('bbbbbbbbbbbbbbbbb',chunks)


        chunks.sort((a, b)=>a.split('-')[1]-b.split('-')[1])
        
        chunks = chunks.map(cp=>
            path.resolve(chunkDir,cp)
        )
        await this.mergeChunks(chunks, filePath, size)
    }

    async mergeChunks(files, dest, size){

        const pipStream = (filePath, writeStream) =>
            new Promise((resolve)=>{
                const readStream = fse.createReadStream(filePath)
                readStream.on('end', ()=>{
                    fse.unlinkSync(filePath)
                    resolve()
                })
                readStream.pipe(writeStream)
            })

        await Promise.all(files.map((file, index)=>
                    pipStream(file, fse.createWriteStream(dest, {
                        start: index*size,
                        end:(index+1)*size
                    })
                )
            )
        )
    }

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