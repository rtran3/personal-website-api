require('dotenv').config();
const express = require('express');
const nodeMailer = require('nodemailer');

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.post('/api/submit', (req, res) => {
    console.log(req.body);
    const transporter = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.AUTH_USER,
          pass: process.env.AUTH_PASS
        }
    });

    const mailOptions = {
        from: 'Contact Form Submission',
        to: process.env.AUTH_USER,
        subject: 'Name: ' + req.body.firstName + ', ' + req.body.lastName + ' Email: ' + req.body.emailAddress,
        text: req.body.msg
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send({msg:'Error sending email'});
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({msg:'Email sent successfully'});
        }
    });
});

module.exports = app;
