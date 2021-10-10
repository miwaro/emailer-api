const express = require('express');
const bodyParser = require('body-parser');
const emailer = require('./emailer');
// recaptcha
const request = require('request');


const port = process.env.PORT || 3002;

const app = express();

//enable CORS
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCrossDomain);

app.use(express.static(__dirname + '/dist'));

//middleware for parsing request body
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



//handlers to respond to post request from client & send email

// app.post('/', (req, res) => {
//     console.log('Request received.');
//     emailer.sendEmail(req, res);
// });


// recaptcha post

app.post('/', (req, res) => {
    console.log('Request received.');
    if (
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ) {
        return res.json({
            "success": false,
            "msg": "Please select captcha"
        })
    }

    // Secret Key
    const secretKey = '6LcmrrocAAAAALoZyr8K_H58pI0upUbl15enHYwB';

    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    // Make Request To VerifyURL
    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body)

        // If Not Successful
        if (body.success !== undefined && !body.success) {
            return res.json({
                "success": false,
                "msg": "Failed Captcha Verification"
            })
        } else {
            emailer.sendEmail(req, res);
        }

        // If Successful

        return res.json({
            "success": true,
            "msg": "Captcha Passed"
        })

    });

});

app.post('/', (req, res) => {
    console.log('Request received.');
    emailer.sendEmail(req, res);
});

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});