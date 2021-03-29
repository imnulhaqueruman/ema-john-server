const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mc16x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
const port = 5000
app.use(bodyParser.json());
app.use(cors());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJohnStore").collection("shop");
  const ordersCollection = client.db("emaJohnStore").collection("order");
    app.post('/addProducts',(req,res) =>{
        const products = req.body;
        console.log(products);
        collection.insertOne(products)
        .then(result =>{
            console.log(result);
            res.send(result.insertedCount);
        })
    })
    app.get('/products',(req,res) =>{
        collection.find({})
        .toArray((err,documents) =>{
            res.send(documents);
        })
    })
    app.get('/product/:key',(req,res) =>{
        collection.find({key:req.params.key})
        .toArray((err,documents) =>{
            res.send(documents[0]);
        })
    })
    app.post('/productByKeys',(req,res) =>{
        const productKeys = req.body
        collection.find({key:{$in:productKeys}})
        .toArray((err,documents) =>{
            res.send(documents)
        })
    })
    app.post('/addOrder',(req,res) =>{
        const order = req.body;
        //console.log(products);
        ordersCollection.insertOne(order)
        .then(result =>{
            console.log(result);
            res.send(result.insertedCount > 0);
        })
    })
});


app.listen(port)