const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const { db } = require("./firebase");

const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.send("We are live!")
});

app.post("/", express.json(), (request, response) => {
    const agent = new WebhookClient({ request, response });
    
});

module.exports = app;