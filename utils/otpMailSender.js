const nodemailer= require("nodemailer");
const otpMailSender= async(email, title, body)=> {
    try{
        let transporter= nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            secure: false
        })
        let info= await transporter.sendMail({
            from: `From ${process.env.MAIL_USER}`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        console.log(info.response)
        return info
    }catch(error){
        console.error("Error while sending mail.....",error.message)
    }
}
module.exports= otpMailSender;