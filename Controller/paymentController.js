const { generateAccessToken } = require("../utils/commonFunction");
const stripe = require('stripe')('sk_test_51OOKRCSHn7J9oTBWYT2TUX4fS2NO60QpAp3ZsJ6Mfm7nXBy99rcdjRpGJHmBBatiXkJw6DpO9UJxSAhSFk25333C008ZVF8TfH');
require('dotenv').config();

const stripeCreatePaymentMethod = async (req, res) => {

    console.log(req.body)
    // try {

    //     const confirmPayment = await stripe.confirmCardPayment(clientSecret, {
    //         payment_method: {
    //             card: cardElement,
    //             billing_details: {
    //                 name: 'Jenny Rosen',
    //                 // Add other billing details if needed
    //             },
    //         },
    //     });

    //     if (confirmPayment.error) {
    //         console.error("Error confirming payment:", confirmPayment.error.message);
    //     } else if (confirmPayment.paymentIntent.status === "succeeded") {
    //         console.log("Payment succeeded!");
    //         // You can update your UI, show a success message, etc.
    //     }
    // } catch (error) {
    //     console.error("Error:", error.message);
    // }


}


const payAmount = async (req, res) => {

    const accessToken = await generateAccessToken(process.env.CLIENT_ID, process.env.SECTRET_ID)
    const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: req.params.price,
                },
            },

        ],

        "payment_source": {
            "paypal": {
                experience_context: {
                    "return_url": "http://localhost:3000/processingPage",
                    "cancel_url": "http://www.example.com/cancelUrl"
                }
            }
        }
    };
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,

        },
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (response) {
        try {
            const jsonResponse = await response.json();
            res.send(jsonResponse)


        }
        catch (err) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    }
};


const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken(process.env.CLIENT_ID, process.env.SECTRET_ID)

    const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,

        },
    });
    if (response) {

        try {
            const jsonRes = await response.json()
            console.log("capture order", jsonRes)
            return jsonRes;
        } catch (error) {
            console.log(error)
        }
    }
}

const stripePayment = async (req, res) => {

    const { product, User ,userData } = req.body

    console.log(userData)
    try {



        const customer = await stripe.customers.create({
            name: User.name,
            email: User.email,
            address: {
                city: userData.City,
                country: userData.Country,
                line1: userData.Line1,
                line2: userData.Line2,
                postal_code: userData.PostalCode,
                state: userData.State,
            },
        });


 
        if (customer) {

            const paymentIntent = await stripe.paymentIntents.create({
                amount: product.price,
                currency: 'USD',
                automatic_payment_methods: {
                    enabled: true,
                },
                customer: customer.id,
                description: 'Purchase of product from your store',
            });
            console.log('------------------------', paymentIntent.id);
            res.status(200).json({ clientSecret: paymentIntent.client_secret });
        }
    } catch (error) {
        console.error('Error creating PaymentIntent:', error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { stripePayment, payAmount, captureOrder, stripeCreatePaymentMethod }