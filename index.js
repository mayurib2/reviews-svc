const express = require('express');
const cors = require('cors');
require('dotenv').config({path:'/home/ubuntu/.env'});
const businesses = require('./routes/businesses');
const app = express();
const bodyparser = require("body-parser");
const port = process.env.PORT || 8000;


app.use(cors())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use('/businesses', businesses);

app.get('/', function (req, res) {
    res.send('Hello World')
})


app.listen(port, function () {
    console.log(' listening on port', port);
});

module.exports = app;
