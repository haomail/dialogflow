const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const { db } = require('./firebase');

const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.send("We are live!")
});

app.post("/", express.json(), (request, response) => {
    const agent = new WebhookClient({ request, response });

    // 00_Welcome
    const welcome = (agent) => {
      const responses = {
        richContent: [
          [
            {
              subtitle: "Pesan tiketmu sekarang!",
              title: "Pesan Tiket",
              type: "list",
              event: {
                languageCode: "",
                name: "ticket_booking",
                parameters: {}
              }
            },
            {
              type: "divider"
            },
            {
              title: "Layanan",
              subtitle: "Layanan yang kami sediakan khusus untuk kamu :)",
              event: {
                languageCode: "",
                name: "services",
                parameters: {}
              },
              type: "list"
            },
            {
              type: "divider"
            },
            {
              subtitle: "Mari berkenalan dengan kami!",
              type: "list",
              title: "Tentang Kami",
              event: {
                name: "about_us",
                parameters: {},
                languageCode: ""
              }
            },
            {
              type: "divider"
            },
            {
              subtitle: "Sampaikan keluhanmu, kami siap membantu :)",
              title: "Keluhan",
              type: "list",
              event: {
                name: "problem",
                languageCode: "",
                parameters: {}
              }
            }
          ]
        ]
      };
      agent.add(new Payload(agent.UNSPECIFIED, responses, { sendAsMessage: true, rawPayload: true }));
    };

    // 01_Demo
    const demo = (agent) => {
        agent.add("Sending response from Webhook");
    };

    // 02_Ticket_Booking
    const ticketBooking = (agent) => {
      agent.add("Untuk memesan, Anda dapat memesan langsung dari website ini atau melalui aplikasi pemesanan tiket sebagai berikut:")
        const responses = {
            richContent: [
              [
                {
                  type: "list",
                  title: "Website",
                  subtitle: "Pesan langsung melalui website kami",
                  event: {
                    name: "website_booking",
                    languageCode: "",
                    parameters: {}
                  }
                },
                {
                  type: "divider"
                },
                {
                  type: "list",
                  title: "Aplikasi Pemesanan Tiket",
                  subtitle: "Pesan tiket di aplikasi andalanmu",
                  event: {
                    name: "app_booking",
                    languageCode: "",
                    parameters: {}
                  }
                }
              ]
            ]
          }
        agent.add(new Payload(agent.UNSPECIFIED, responses, { sendAsMessage: true, rawPayload: true }));
    };

    // 03_Website_Booking
    const websiteBooking = (agent) => {
        const responses = {
            richContent: [
                [
                    {
                        type: "info",
                        subtitle: "Klik pesan ini untuk memesan tiket melalui website kami",
                        actionLink: "https://example.com"
                    }
                ]
            ]
        }
        agent.add(new Payload(agent.UNSPECIFIED, responses, { sendAsMessage: true, rawPayload: true }));
    };

    // 04_App_Booking
    const appBooking = (agent) => {
        agent.add("Langsung pesan tiket perjalanan melalui aplikasi favoritmu!")
        const responses = {
            richContent: [
                [
                  {
                    type: "chips",
                    options: [
                      {
                        text: "Traveloka",
                        image: {
                          src: {
                            rawUrl: "https://qph.cf2.quoracdn.net/main-qimg-500f9439fcf5d771fe930f670849e490",
                          }
                        },
                        link: "https://www.traveloka.com/en-id",
                      },
                      {
                        text: "Booking.com",
                        image: {
                          src: {
                            rawUrl: "https://cdn.freelogovectors.net/wp-content/uploads/2023/05/booking_com_icon_logo-freelogovectors.net_.png",
                          }
                        },
                        link: "https://www.booking.com/",
                      },
                      {
                        text: "Tiket.com",
                        image: {
                          src: {
                            rawUrl: "https://miro.medium.com/v2/resize:fit:1400/1*wqszIaQTpUABbMZN7bNSyg.jpeg",
                          }
                        },
                        link: "https://www.tiket.com/",
                      },
                    ],
                  },
                ],
              ],
            };
        agent.add(new Payload(agent.UNSPECIFIED, responses, {sendAsMessage: true, rawPayload: true}));
    };

    const intentMap = new Map();
    intentMap.set('00_Welcome', welcome);
    intentMap.set('01_Demo', demo);
    intentMap.set('02_Ticket_Booking', ticketBooking);
    intentMap.set('03_Website_Booking', websiteBooking);
    intentMap.set('04_App_Booking', appBooking);
    agent.handleRequest(intentMap);
});

module.exports = app;