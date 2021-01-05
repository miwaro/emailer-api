const express = require('express');
const bodyParser = require('body-parser');
const emailer = require('./emailer');

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
app.post('/', (req, res) => {
    console.log('Request received.');
    emailer.sendEmail(req, res);
});

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});