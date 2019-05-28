const nodemailer = require('nodemailer');
const AssetsController = require('./assets.controller');
const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports = {
  generateReport: generateReport
};
/**
 * Generate Report
 */
async function generateReport(req, res) {
  let data = AssetsController.getAssets;

  const browser = await puppeteer.launch({ headless: true   });
  const page = await browser.newPage();
  await page.goto('http://localhost:8082/', { waitUntil: 'networkidle0' });
  await page.type('#email', 'admin');
  await page.type('#password', '123456');
  await page.click('#submit');
  await page.addStyleTag({
    content: '#Actions {display: none}'
  });

  await page.pdf({ path:'AssetReport.pdf',format: 'A2' });

//   await page.click('#AssignmentHistory');
  await page.goto('http://localhost:8082/home/assignmentHistory', { waitUntil: 'networkidle0' });

  await page.pdf({ path:'AssignmentReport.pdf',format: 'A2' });
  // await browser.close();

  // fs.writeFile('AssetReport.pdf', pdfAssets, function(err) {
  //   if (err) return console.log(err);
  //   else console.log('File is saved successfully');
  // });

  // fs.writeFile('AssignmentReport.pdf', pdfAssignment, function(err) {
  //   if (err) return console.log(err);
  //   else console.log('File is saved successfully');
  // });
//   res.set({
//     'Content-Type': 'application/pdf',
//     'Content-Length': pdfAssets.length
//   });
//   res.send(pdfAssignment);

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
      to: 'davisolo@cisco.com,sudhsure@cisco.com',
      subject:`Weekly Asset Report and Assignment History`,
      text: 'Please find attached the weekly Asset Report and Assignment History',
      attachments:[{path:'AssetReport.pdf'},{path:'AssignmentReport.pdf'}]
  };

  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log("Email sent: " + info.response);
      }
  });
}
