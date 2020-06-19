const axios = require('axios');
const path = require('path');

const PK = "pk_test_7d9921be-b71f-47fa-b996-29515831d911";
const SK = "sk_test_07fa5e52-3971-4bab-ae6b-a8e26007fccc";
const API = "https://api.sandbox.checkout.com/";



var appRouter = function (app) {
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    });

    app.post("/pay/", async (req, res) => {
        let token = req.body.token;

        let payment;
        try {
            payment = await axios.post(API + 'payments', {
                "source": {
                    "type": "token",
                    "token": token
                },
                "amount": 9900,
                "currency": "GBP",
                "reference": "ORD-5023-4E89"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': SK
                }
            })
            res.status(200).send(payment.data);
        }
        catch (err) {
            res.status(500).send(err.response);
        }
    });

    app.post("/refund/:p_id", async (req, res) => {
        let p_id = req.params.p_id;
        console.log(p_id);
        try {
            let payment = await axios.post(API + 'payments/' + p_id + '/refunds', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': SK
                }
            })
            res.status(200).send(payment.data.action_id);
        }
        catch (err) {
            res.status(500).send(err.response);
        }
    });


    // KLARNA
    app.post("/klarnaSession/", async (req, res) => {
        console.log("Initialising Klarna Session");
        let payment;
        try {
            payment = await axios.post("https://api.sandbox.checkout.com/klarna-external/credit-sessions", {
                "purchase_country": "GB",
                "currency": "GBP",
                "locale": "en-GB",
                "amount": 2499,
                "tax_amount": 1,
                "products": [{
                    "name": "Brown leather belt",
                    "quantity": 1,
                    "unit_price": 2499,
                    "tax_rate": 0,
                    "total_amount": 2499,
                    "total_tax_amount": 0
                }]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': SK
                }
            })
            console.log(payment.data)
            res.status(200).send(payment.data);
        }
        catch (err) {
            res.status(500).send(err.response);
        }
    });

    app.post("/klarnaPayment/", async (req, res) => {
        let authorization_token = req.body.authorization_token;
        console.log("Initialising Klarna Payment: " + authorization_token);

        let payment;
        try {
            payment = await axios.post(API + 'payments', {
                "amount": 1000,
                "currency": "GBP",
                "capture": false,
                "source": {
                    "type": "klarna",
                    "authorization_token": authorization_token,
                    "locale": "en-GB",
                    "purchase_country": "GB",
                    "tax_amount": 0,
                    "billing_address": {
                        "given_name": "John",
                        "family_name": "Doe",
                        "email": "johndoe@email.com",
                        "title": "Mr",
                        "street_address": "13 New Burlington St",
                        "street_address2": "Apt 214",
                        "postal_code": "W13 3BG",
                        "city": "London",
                        "phone": "01895808221",
                        "country": "GB"
                    },
                    "customer": {
                        "date_of_birth": "1970-01-01",
                        "gender": "male"
                    },
                    "products": [
                        {
                            "name": "Battery Power Pack",
                            "quantity": 1,
                            "unit_price": 1000,
                            "tax_rate": 0,
                            "total_amount": 1000,
                            "total_tax_amount": 0
                        }
                    ]
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': SK
                }
            })
            console.log(payment.data)
            res.status(200).send(payment.data);
        }
        catch (err) {
            res.status(500).send(err.response);
        }
    });
}

module.exports = appRouter;
