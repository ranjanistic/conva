const nodemailer = require("nodemailer"),
  { MAILUSER, MAILPASS } = require("../config"),
  path = require("path"),
  ejs = require("ejs");
  
class Mail {
  getVerificationContent(to, username, link) {
    return `Hey ${username}, please verify ${to} by visiting ${link}`;
  }
  async sendVerification(to, username, link) {
    const data = { to, username, link };
    const text = this.getVerificationContent(to, username, link);
    const html = await ejs.renderFile(
      path.join(__dirname + `/../views/verification.ejs`),
      { data }
    );
    this.send(data.to, "Verification", { text, html });
  }
  send(to, subject, body = { text: String, html: String }) {
    console.log("sending:", to, MAILUSER, MAILPASS);
    nodemailer
      .createTransport({
        host: MAILHOST,
        port: MAILPORT,
        secureConnection: false,
        auth: {
          user: MAILUSER,
          pass: MAILPASS,
        },
        starttls: {
          ciphers: "SSLv3",
        },
      })
      .sendMail(
        {
          from: MAILUSER,
          to,
          subject,
          ...body,
        },
        (error, info) => {
          console.log(error || info);
        }
      );
  }
}

module.exports = new Mail();
