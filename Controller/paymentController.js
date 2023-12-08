const { generateAccessToken } = require("../utils/commonFunction");


//after the person approves the payement the capute teh payemnt method is called
const CapturePayment = async (req, res) => {

    var orderId = req.params.orderId
let access_token = await generateAccessToken()

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/` + orderId + `/capture`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        },
    });

}


//Created by front end but for now we are creating it
const CreateOrder = async (req, res) => {
let access_token = await generateAccessToken()

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        },
        body:
            JSON.stringify({
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "reference_id": "d9f80740-38f0-11e8-b467-0ed5f89f718b",
                        "amount": {
                            "currency_code": "USD",
                            "value": "115.00"
                        }
                    }
                ]
            })

    });
    const data = await response.json();
    res.send(data)
}

module.exports={
  CreateOrder,
  CapturePayment
}