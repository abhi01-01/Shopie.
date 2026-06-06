const nodeMailer = require("nodemailer") ;

const sendEmail = async(options) =>{
    const service = process.env.SMTP_SERVICE || process.env.SMPT_SERVICE;
    const mail = process.env.SMTP_MAIL || process.env.SMPT_MAIL;
    const password = process.env.SMTP_PASSWORD || process.env.SMPT_PASSWORD;

    if (!service || !mail || !password) {
        throw new Error("SMTP credentials are not configured.");
    }

    const transporter = nodeMailer.createTransport({
        service,
        auth:{
            user:mail,
            pass:password
        }
    })
    const mailOptions = {
        from:mail,
        to:options.email,
        subject:options.subject,
        text:options.message
    };

    await transporter.sendMail(mailOptions) ;
};


module.exports = sendEmail ;
