// const nodemailer = require("nodemailer");

// const sendEmail = async options=>{
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth:{
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASSWORD,
//         }
//     });

//     // define the email options
//     const options = {
//         from: "Abdollah Altamer <abdol.altamer@gmail.com>",
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         // html:
//     };

//     // Send the email
//     await transporter.sendMail(options);
// }

// module.exports = sendEmail;
