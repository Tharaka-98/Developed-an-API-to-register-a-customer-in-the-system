var express = require("express")
var app = express()
var db = require("./database.js")
var cron = require('node-cron');
var bodyParser = require("body-parser");
const { request, response } = require("express");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let HTTP_PORT = 8080
const cors = require('cors');
app.use(cors({
    origin: '*'
}));



// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.post("/api/customer/register/", (req, res, next) => {

    try {

        var errors = [];

        if (!req.body) {
            errors.push("An invalid input");
        }

        const { 
            name,
            address,
            email,
            dateofBirth,
            gender,
            age,
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv,
            timeStamp
        } = req.body;

        const emailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_'{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const creditCardregEx = /^\d{12}$/;

        //validate Email address
        if(emailRegEx.test(email)!=true){
            res.status(400).send("invalid Email Address");
            return;
        }

        //validate credit card 12 digits
        if(creditCardregEx.test(cardNumber)!=true){
            res.status(400).send("Invalid credit card number, only 12 digits allowed");
            return;
        }

        var sql = 'INSERT INTO customer (name, address, email, dateofBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamp) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        var params = [name, address, email, dateofBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamp];

        db.run(sql, params, function (err, result) {

            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            } else {
                res.status(201).json({
                    "message": "Customer "+name+" has registered" ,
                    "customerid": this.lastID
                })
            }

        });

    } catch (E) {
        res.status(400).send(E);
    }
    
});




// Root path
app.get("/", (req, res, next) => {
    res.json({ "message": "University of Moratuwa" })
});