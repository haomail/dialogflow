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
      agent.add(new Payload(agent.UNSPECIFIED, responses, { sendAsMessage: true, rawPayload: true, platform: "PLATFORM_UNSPECIFIED" }));
    };

    // 01_Demo
    const demo = (agent) => {
        agent.add("Sending response from Webhook");
    };

    // 02_Ticket_Booking
    const ticketBooking = (agent) => {
      const responses = {
        richContent: [
          [
            {
              type: "chips",
              options: [
                {
                  text: "Website",
                  link: "https://example.com"
                },
                {
                  text: "Aplikasi Pemesanan Tiket"
                },
              ],
            }
          ]
        ]
      };
      agent.add("Untuk memesan, Anda dapat memesan langsung dari website ini atau melalui aplikasi pemesanan tiket sebagai berikut:");
      agent.add(new Payload(agent.UNSPECIFIED, responses, { sendAsMessage: true, rawPayload: true, platform: "PLATFORM_UNSPECIFIED" }));
    };
    
    // 03_App_Booking
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
        agent.add(new Payload(agent.UNSPECIFIED, responses, { sendAsMessage: true, rawPayload: true, platform: "PLATFORM_UNSPECIFIED" }));
    };

    // 04_Services
    const services = (agent) => {
      const responses = {
        richContent: [
          [
            {
              type: "list",
              title: "Kelas Tiket",
              event: {
                name: "ticket_class",
                languageCode: "",
                parameters: {}
              }
            },
            {
              type: "divider"
            },
            {
              type: "list",
              title: "Fasilitas",
              event: {
                name: "facility",
                languageCode: "",
                parameters: {}
              }
            },
            {
              type: "divider"
            },
            {
              type: "list",
              title: "Informasi Bagasi",
              event: {
                name: "luggage",
                languageCode: "",
                parameters: {}
              }
            },
            {
              type: "divider"
            },
            {
              type: "list",
              title: "Keanggotaan",
              event: {
                name: "membership",
                languageCode: "",
                parameters: {}
              }
            },
            {
              type: "divider"
            },
            {
              type: "list",
              title: "Reservasi",
              event: {
                name: "reservation",
                languageCode: "",
                parameters: {}
              }
            },
            {
              type: "divider"
            },
            {
              type: "list",
              title: "Antar Jemput",
              event: {
                name: "",
                languageCode: "",
                parameters: {}
              }
            },
            {
              type: "divider"
            },
            {
              type: "list",
              title: "Destinasi Populer",
              event: {
                name: "",
                languageCode: "",
                parameters: {}
              }
            }
          ]
        ]
      }
      agent.add("Pilih layanan kami yang sesuai dengan kebutuhanmu✈️");
      agent.add(new Payload(agent.UNSPECIFIED, responses, { sendAsMessage: true, rawPayload: true, platform: "PLATFORM_UNSPECIFIED" }));
    };

    // 05_Ticket_Class
    const classes = (agent) => {
      const responses = {
        richContent: [
          [
            {
              type: "info",
              title: "Kelas Tiket",
              subtitle: "Kami menyediakan beberapa kelas yang dapat kamu pilih sesuai preferensimu. Kamu bisa mengeceknya dengan klik pesan ini👆",
              actionLink: "https://example.com"
            }
          ]
        ]
      }
      agent.add(new Payload(agent.UNSPECIFIED, responses, { sendAsMessage: true, rawPayload: true, platform: "PLATFORM_UNSPECIFIED" }));
    };

    // 06_Facility
    const facility = (agent) => {
      const responses = {
        richContent: [
          [
            {
              type: "info",
              title: "Fasilitas",
              subtitle: `Transportasi kami dilengkapi dengan kursi yang nyaman, WiFi, colokan listrik, AC, pantry, selimut*, snack* dan makanan berat*. Kami berusaha memberikan pengalaman perjalanan yang nyaman.
              \n *Tergantung kelas transportasi yang kamu pesan.`
            }
          ]
        ]
      }
      agent.add(new Payload(agent.UNSPECIFIED, responses, { sendAsMessage: true, rawPayload: true, platform: "PLATFORM_UNSPECIFIED" }));
    };

    // 07_Luggage
    const luggage = (agent) => {
      const responses = {
        richContent: [
          [
            {
              type: "info",
              title: "Informasi Bagasi",
              subtitle: "Berat maksimal bagasi untuk setiap penumpang bergantung kepada transportasi yang dinaiki. Informasi selengkapnya dapat kamu cek dengan klik pesan ini👆",
              actionLink: "https://example.com"
            }
          ]
        ]
      };
      agent.add(new Payload(agent.UNSPECIFIED, responses, { sendAsMessage: true, rawPayload: true, platform: "PLATFORM_UNSPECIFIED" }));
    };

    // 08_Membership
    const membership = (agent) => {
      const responses = {
        richContent: [
          [
            {
              type: "info",
              title: "Keanggotaan",
              subtitle: "Dengan menjadi member keanggotaan, banyak diskon dan promo yang akan menantimu! Informasi selengkapnya dapat kamu lihat dengan klik pesan ini👆",
              actionLink: "https://example.com"
            }
          ]
        ]
      }
      agent.add(new Payload(agent.UNSPECIFIED, responses, { sendAsMessage: true, rawPayload: true, platform: "PLATFORM_UNSPECIFIED" }));
    };

    // 09_Reservation
    const reservation = (agent) => {
      const phoneNumber = agent.parameters.phonenumber;
      const name = agent.parameters.name.name;
      const details = agent.parameters.details;
      console.log(phoneNumber);
      console.log(name);
      console.log(details);

      agent.add(`Berikut nomor telepon ${phoneNumber} dengan kak ${name} untuk keperluan ${details}. Pegawai kami akan segera menghubungi anda untuk reservasi transportasi kami. \n 
      Terima kasih dan semoga harimu menyenangkan!😊`);
      return db.collection("reservation").add({
      phoneNumber: phoneNumber,
      name: name,
      details: details
      }).then(ref=>
          console.log("Reservation added to Firebase"));
    };

    const intentMap = new Map();
    intentMap.set('00_Welcome', welcome);
    intentMap.set('01_Demo', demo);
    intentMap.set('02_Ticket_Booking', ticketBooking);
    intentMap.set('03_App_Booking', appBooking);
    intentMap.set('04_Services', services);
    intentMap.set('05_Ticket_Class', classes);
    intentMap.set('06_Facility', facility);
    intentMap.set('07_Luggage', luggage);
    intentMap.set('08_Membership', membership);
    intentMap.set('09_Reservation', reservation);
    agent.handleRequest(intentMap);
});

module.exports = app;