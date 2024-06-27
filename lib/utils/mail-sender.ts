import  nodemailer from 'nodemailer';
const SMTP_MAIL_HOST = process.env.SMTP_MAIL_HOST;
const SMTP_MAIL_USER = process.env.SMTP_MAIL_USER;
const SMTP_MAIL_PASS = process.env.SMTP_MAIL_PASS;
const SMTP_MAIL_SECURE = Boolean(process.env.SMTP_MAIL_SECURE) || false;
const MAIL_FROM = process.env.MAIL_FROM;

export function replaceInText(text: string, toReplace: { [key: string]: string }) {
  let resText = text;
  Object.keys(toReplace).forEach((key) => {
    resText = resText.replace(new RegExp(`{{${key}}}`, 'ig'), toReplace[key]);
  });
  return resText;
}

const sendMail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: SMTP_MAIL_HOST,
    secure: SMTP_MAIL_SECURE,
    auth: {
      user: SMTP_MAIL_USER,
      pass: SMTP_MAIL_PASS
    }
  });
  const mailOptions = {
    from: MAIL_FROM,
    to,
    subject,
    html
  };

  return transporter.sendMail(mailOptions);
};

export default sendMail;
