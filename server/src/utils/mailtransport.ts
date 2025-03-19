import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service:'gmail',
  port:456,
  secure:false,
  auth:{
    user:process.env.smtp_email,
    pass:process.env.smtp_password
  }
});
export default transporter;