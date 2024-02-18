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

    // 01_Demo
    const demo = (agent) => {
        agent.add("Sending response from Webhook")
    };

    // 02_Ticket_Booking
    const ticketBooking = (agent) => {
        agent.add("Untuk memesan, Anda dapat memesan langsung dari website ini atau melalui aplikasi pemesanan tiket sebagai berikut:");
        const response = {
            "richContent": [
              [
                {
                  "title": "Website",
                  "type": "list",
                  "event": {
                    "parameters": {},
                    "languageCode": "",
                    "name": "website_booking"
                  },
                  "subtitle": "Pesan langsung melalui website kami"
                },
                {
                  "type": "divider"
                },
                {
                  "type": "list",
                  "event": {
                    "name": "app_booking",
                    "parameters": {},
                    "languageCode": ""
                  },
                  "title": "Aplikasi Pemesanan Tiket",
                  "subtitle": "Pesan tiket di aplikasi andalanmu"
                }
              ]
            ]
          }
    };

    // 03_Website_Booking
    const websiteBooking = (agent) => {
        const responses = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "subtitle": "Klik pesan ini untuk memesan tiket melalui website kami",
                        "actionLink": "https://example.com"
                    }
                ]
            ]
        }
        agent.add(new Payload(agent.UNSPECIFIED, responses, {sendAsMessages: true, rawPayload: true}));
    };

    // 04_App_Booking
    const appBooking = (agent) => {
        agent.add("Langsung pesan tiket perjalanan melalui aplikasi favoritmu!")
        const responses = {
            "richContent": [
                [
                  {
                    "type": "chips",
                    "options": [
                      {
                        "text": "Traveloka",
                        "image": {
                          "src": {
                            "rawUrl": "https://qph.cf2.quoracdn.net/main-qimg-500f9439fcf5d771fe930f670849e490",
                          }
                        },
                        "link": "https://www.traveloka.com/en-id",
                      },
                      {
                        "text": "Booking.com",
                        "image": {
                          "src": {
                            "rawUrl": "https://cdn.freelogovectors.net/wp-content/uploads/2023/05/booking_com_icon_logo-freelogovectors.net_.png",
                          }
                        },
                        "link": "https://www.booking.com/",
                      },
                      {
                        "text": "Tiket.com",
                        "image": {
                          "src": {
                            "rawUrl": "https://miro.medium.com/v2/resize:fit:1400/1*wqszIaQTpUABbMZN7bNSyg.jpeg",
                          }
                        },
                        "link": "https://www.tiket.com/",
                      },
                    ],
                  },
                ],
              ],
            };
        agent.add(new Payload(agent.UNSPECIFIED, responses, {sendAsMessages: true, rawPayload: true}));
    };

    const intentMap = new Map();
    intentMap.set('01_Demo', demo);
    intentMap.set('02_Ticket_Booking', ticketBooking);
    intentMap.set('03_Website_Booking', websiteBooking);
    intentMap.set('04_App_Booking', appBooking);
});

module.exports = app;