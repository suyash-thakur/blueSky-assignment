const  express =  require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const countryEndpoints = require('./routes/country');
const redisClient = require("./helper/redisClient");

const swaggerUi = require("swagger-ui-express"),
    swaggerDocument = require("./swagger.json");
  

const connection_url = `mongodb+srv://Admin:${process.env.MONGO_PASSWORD}@cluster0.ddzlm.mongodb.net/urlShortner?retryWrites=true&w=majority`;

mongoose.connect(connection_url, {
}).then(() => { 
    console.log("Connected to database!");
}).catch((e) => { 
    console.log("Connection failed!", e);
});
app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
);
app.use('/', countryEndpoints);
app.use(function (err, req, res, next) {
    res.status(500);
    if (err.type == 'custom') {
        return res.send(err.message)
    }
    res.send("Server Error");
 });
module.exports = app;
