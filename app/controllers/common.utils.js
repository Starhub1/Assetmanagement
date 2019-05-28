const nodemailer = require("nodemailer");

module.exports = {
    sendEmail:sendEmail,
};

/**
 * Show Login page
 */

function sendEmail(to,subject,text,cc='davisolo@cisco.com,sudhsure@cisco.com',from="CISCO Mobile Management <cx.mobilemanagement@gmail.com>"){

    console.log(to);
    console.log(subject);
    console.log(text);
    console.log(cc);
    console.log(from);
    //send a mail
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "cx.mobilemanagement@gmail.com",
            pass: "Cisco@1234"
        }
    }); 

    var mailOptions = {
        from: from,
        to: to,
        cc: cc,
        subject:subject,
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });

}