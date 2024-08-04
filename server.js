const express = require('express');
const sha256 = require('sha256');
const app = express();
const uniqid = require('uniqid')
const axios = require('axios')
const cors = require('cors');
const Transaction = require('./model/transaction.model');
const mongoose = require('mongoose');

app.use(cors());

const SERVER_URL = "https://working-with-phonepe-api-1.onrender.com/"
const CLIENT_URL = "https://working-with-phonepe-api.onrender.com/"

//connecting database
const uri = "mongodb+srv://new_user_fahd:fahd@cluster0.hyeth5m.mongodb.net/phonepe?retryWrites=true&w=majority"
mongoose.connect(uri);
const connection = mongoose.connection;

connection.once('open',()=>{
    console.log("MongoDB connection is established!");
})



//API callings
// app.get('/', (req, res) => {
//     res.json({ 'data': "Payment page" })
// })

app.get('/history', (req,res)=>{
    Transaction.find()
    .then((element)=>res.status(200).json(element))
    .catch((err)=>res.status(400).json("Error:"+err))
})

const PHONEPE_HOST_URI = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const PHONEPE_URI = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const API_END_POINT = "/pg/v1/pay";
const CHECK_STATUS_END_POINT = "/pg/v1/status"
const SALT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const SALT_INDEX = 1;

app.post('/pay/:name/:amount', (req, res) => {
    // const amount=req.cookies.amount;
    // const amount="1000";
    const name= req.params.name;
    const amount = req.params.amount;

    const MERCHANT_ID = "PGTESTPAYUAT86"
    const MERCHANT_TRANSACTION_ID = uniqid();     //"MT7850590068188104"
    const USER_ID = "abc1234";

    const payload = {
        "merchantId": MERCHANT_ID,
        "merchantTransactionId": MERCHANT_TRANSACTION_ID,
        "merchantUserId": "MUID123",
        "amount": amount,
        "redirectUrl": `${SERVER_URL}redirect-url/${MERCHANT_ID}/${MERCHANT_TRANSACTION_ID}/${name}/${amount}`,
        "redirectMode": "REDIRECT",
        "callbackUrl": `${SERVER_URL}redirect-url/${MERCHANT_ID}/${MERCHANT_TRANSACTION_ID}/${name}/${amount}`,
        "mobileNumber": "9999999999",
        "name":name,
        "paymentInstrument": {
            "type": "PAY_PAGE"
        }
    }

    const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
    const BASE64_ENCODED_PAYLOAD = bufferObj.toString("base64");
    const xVERIFY = sha256(BASE64_ENCODED_PAYLOAD + API_END_POINT + SALT_KEY) + "###" + SALT_INDEX;

    axios.post(PHONEPE_URI, {
        'request': BASE64_ENCODED_PAYLOAD
    }, {
        headers: {
            'Access-Control-Allow-Origin':"*",
            'Content-Type': 'application/json',
            'X-VERIFY': xVERIFY,
            'accept': 'application/json'
        }
    }).then((response) => {
        // res.send(response.data);
        // res.send("Success");
        // res.send("Merchant Transaction Id: "+response.data.data.merchantTransactionId)
        
        // return res.json({
        //     'url': response.data.data.instrumentResponse.redirectInfo.url,
        //     'amount': amount

        // });

        return res.status(200).send(response.data.data.instrumentResponse.redirectInfo.url);
        
        
        // window.location(response.data.data.instrumentResponse.redirectInfo.url)
        // console.log("Url is: "+response.data.data.instrumentResponse.redirectInfo.url)
    }).catch((err) => {
        console.error(err);
    })

    // axios.request(payload).then(function(response){
    //     console.log(response.data)
    // })
    // .catch(function(err){
    //     console.log(err)
    // })
})


app.get('/redirect-url/:merchantId/:merchantTransactionId/:name/:amount',(req, res) => {
    const { merchantId, merchantTransactionId } = req.params;
    const name = req.params.name      //changed
    const date = Date.now();  
    const amount = req.params.amount/100;     //changed
    const transactionId=merchantTransactionId;

    
    if (merchantTransactionId) {
        // res.send({merchantTransactionId})

        const xVERIFY = sha256(`/pg/v1/status/${merchantId}/${merchantTransactionId}` + SALT_KEY) + "###" + SALT_INDEX
        axios.get(`${PHONEPE_HOST_URI}/pg/v1/status/${merchantId}/${merchantTransactionId}`, {
            headers: {
                'Access-Control-Allow-Origin':"*",
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': xVERIFY,
                'X-MERCHANT-ID': merchantId
            }
        })
            .then((response) => {
                if (response.data.success){
                    const newTransaction = new Transaction({
                        name,
                        amount,
                        date,
                        transactionId
                    })

                    newTransaction.save()
                    .then((res)=>res.send)
                    .catch((err)=>res.status(400).json("Error:"+err))
                }

                setTimeout(()=>response.data,5000)
                res.redirect(`${CLIENT_URL}`)
                // res.send(response.data)

                

            }).catch((err) => {
                res.send({ error: 'Error while transaction' })
            })
    }
    else {
        res.send({ error: "Transaction initiated" })
    }
})




app.listen(3001, (req, res) => {
    console.log("Server is running on 3001 ...")
})
