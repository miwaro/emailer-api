const SibApiV3Sdk = require('sib-api-v3-sdk');
const config = require('./config');
const { v4: uuidv4 } = require('uuid');

module.exports.sendEmail = (req, res) => {
    const id = uuidv4();;
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = config.apiKey;
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    const name = req.body.name;
    const type = req.body.type;
    const email = req.body.email;
    const message = req.body.message;
    const html = `
        <h3>You've Received an Inquiry From ${name}</h3>
        <p>Name: ${name}</p>
        <p>Type: ${type}</p>
        <p>Email Address: ${email}</p>
        <p>Message: ${message}</p>
    `;

    sendSmtpEmail.subject = `New Website Inquiry from ${name}`;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { "name": "Knecht Insurance Website Inquiries", "email": "knechtinquires@gmail.com" };
    sendSmtpEmail.to = [{ "email": "knecht@fireflyagency.com", "name": "Knecht Insurance" }];
    sendSmtpEmail.cc = [{ "email": "knechtinquires@gmail.com", "name": "Knecht Insurance Website Inquiries" }];
    sendSmtpEmail.bcc = [{ "email": "knechtinquires@gmail.com", "name": "Knecht Insurance Website Inquiries" }];
    sendSmtpEmail.replyTo = { "email": email, "name": name };
    sendSmtpEmail.headers = { "Inquiry-Id": id };
    sendSmtpEmail.params = { "parameter": "Test", "subject": "New Website Inquiry" };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        res.send('Success');
    }, function (error) {
        console.error(error);
    });
}