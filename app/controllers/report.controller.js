const nodemailer = require("nodemailer");
const AssetsController = require('./controllers/assets.controller');

module.exports = {
    generateReport:generateReport
};
/**
 * Generate Report
 */
function generateReport(req, res) {
    //send a mail
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "cx.mobilemanagement@gmail.com",
            pass: "Cisco@1234"
        }
    });

    var mailOptions = {
        from: "CISCO Mobile Management <cx.mobilemanagement@gmail.com>",
        to: _email,
        cc: 'davisolo@cisco.com,sudhsure@cisco.com',
        subject:`${Asset.AssetDescription} has been returned back by ${_owner} on ${Asset.assignedDate}`,
        text: 'Asset Returned Successfully'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}
