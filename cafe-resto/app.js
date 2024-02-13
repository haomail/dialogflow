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
    
    const openHours = (agent) => {
        agent.add("Kami buka dari [Jam Buka] hingga [Jam Tutup] setiap hari. Apakah ada yang lain yang dapat kami bantu?");
    };

    const location = (agent) => {
        agent.add("[Nama Kafe/Restoran] terletak di [lokasi]. Kami berharap dapat menyambut Anda segera!");
    };
    
    const wifi = (agent) => {
        agent.add("Ya, kami menyediakan layanan Wi-Fi gratis untuk para pelanggan kami. Anda dapat mendapatkan kata sandi di kasir.");
    };
    
    const promo = (agent) => {
        agent.add("Kami memiliki beberapa promo dan diskon spesial. Untuk informasi terbaru, silakan kunjungi halaman promo di situs web kami.");
    };

    const smokingArea = (agent) => {
        agent.add("Tentu, kami menyediakan ruangan untuk merokok beserta dengan asbaknya.");
    };
    
    const halal = (agent) => {
        agent.add("Kami menggunakan bahan-bahan berkualitas yang diolah secara halal. Kami juga sudah memperoleh sertifikat Halal dari MUI dengan nomor [ID]");
    };
      
    const liveMusic = (agent) => {
        agent.add("Kami sering mengadakan pertunjukan musik langsung. Untuk jadwal acara terbaru, silakan cek situs web kami atau tanyakan kepada staf kami.");
    };
    
    const deliveryService = (agent) => {
        const deliveryData = {
            "richContent": [
                [
                  {
                    "type": "info",
                    "title": "Delivery Service",
                    "subtitle": "Ya, kami menyediakan layanan pengantaran. Untuk memesan, Anda dapat memesan langsung dari bot ini atau melalui aplikasi pengiriman makanan sebagai berikut:",
                  },
                  {
                    "type": "chips",
                    "options": [
                      {
                        "text": "Pesan melalui bot"
                      },
                      {
                        "text": "Pesan melalui aplikasi pengantaran makanan"
                      }
                    ]
                  },
                ],
              ],
            };
            agent.add(new dfff.Payload(agent.UNSPECIFIED, deliveryData, {sendAsMessage: true, rawPayload: true}));
  };

  const appDelivery= (agent) => {
    const appData = {
        "richContent": [
            [
              {
                "type": "info",
                "title": "App Delivery",
                "subtitle": "Silahkan pesan dari aplikasi preferensi anda!",
              },
              {
                "type": "chips",
                "options": [
                  {
                    "text": "GoFood",
                    "image": {
                      "src": {
                        "rawUrl": "https://i.pinimg.com/originals/b1/e8/2a/b1e82a8eab25d73af3ec90e1e2c35e21.png",
                      }
                    },
                    "link": "https://gofood.co.id/",
                  },
                  {
                    "text": "ShopeeFood",
                    "image": {
                      "src": {
                        "rawUrl": "https://png.pngtree.com/png-clipart/20221224/original/pngtree-shopefood-logo-png-image_8801636.png",
                      }
                    },
                    "link": "https://shopee.co.id/m/shopeefood",
                  },
                  {
                    "text": "GrabFood",
                    "image": {
                      "src": {
                        "rawUrl": "https://www.liblogo.com/img-logo/gr11g6ed-grab-food-logo-grabfood-colour-sticker-by-grabfoodmy-for-ios-amp-android-.png",
                      }
                    },
                    "link": "https://food.grab.com/id/id/",
                  },
                ],
              },
            ],
          ],
        };
        agent.add(new dfff.Payload(agent.UNSPECIFIED, appData, { sendAsMessage: true, rawPayload: true }));
    }
    
    const botDelivery = (agent) => {
        agent.add("Baik dengan kakak siapa ya namanya?")
  };
  /*
    const botDeliveryCostumer = (agent) => {
        const nama = agent.parameters.name.name;
        const telepon = agent.parameters.phonenumber;
        const alamat = agent.parameters.location.address;
        console.log(nama);
        console.log(telepon);
        console.log(alamat);
    }; */

    const orderMenu = (agent) => {
        const displayMenu = {
            "richContent": [
                [
                  {
                    "title": "Order Menu",
                    "type": "info"
                  },
                  {
                    "type": "chips",
                    "options": [
                      {
                        "text": "Cemilan"
                      },
                      {
                        "text": "Makanan Utama"
                      },
                      {
                        "text": "Minuman"
                      }
                    ]
                  }
                ]
              ]
            } 
            agent.add(new dfff.Payload(agent.UNSPECIFIED, displayMenu, {sendAsMessage: true, rawPayload: true}));
    };

    const fixOrder = (agent) => {
        const nama = agent.context.get("data_costumer").parameters.person.name;
        const telepon = agent.context.get("data_costumer").parameters["phone-number"];
        const alamat = agent.context.get("data_costumer").parameters.location["street-address"];
        const pesanan = agent.context.get("choose_menu").parameters.menu;
        const jumlah = agent.context.get("choose_menu").parameters.quantity;

        console.log(nama);
        console.log(telepon);
        console.log(alamat);
        console.log(pesanan + ' ' + jumlah);
        agent.add("Oke kak, silahkan tunggu ya dalam waktu 15-30 menit akan sampai ke rumah kakak! Terima kasih sudah mempercayai kami >_< Selamat makan!");
        return db.collection("order-db").add({
        name: nama,
        phone_number: telepon,
        home_address: alamat,
        order: pesanan,
        qty: jumlah,
        time: Date.now()
        }).then(ref =>
            console.log("Order details added to DB"));
    };
  
    const tableReservation = (agent) => {
        agent.add("Reservasi meja dapat dilakukan minimal 1 jam sebelum kedatangan. Atas nama siapa kak?")
    };

    const tableReservationCostumer = (agent) => {
        const name = agent.parameters.name.name;
        const person = agent.parameters.person;
        const phoneNumber = agent.parameters.phonenumber;
        const datePhrase = agent.parameters.date;
        const timePhrase = agent.parameters.time;
        const dateTime = convertToFormattedDateTime(datePhrase, timePhrase);

        console.log(name);
        console.log(person);
        console.log(phoneNumber);
        console.log(datePhrase);
        console.log(timePhrase);
        console.log(dateTime);
        agent.add(`Baik kak ${name} dengan nomor telepon ${phoneNumber}, reservasi meja untuk ${person} orang pada ${dateTime}. Sampai ketemu di kafe!`);
        return db.collection("tableReservation").add({
        name: name,
        phoneNumber: phoneNumber,
        person: person,
        dateTime: dateTime
        }).then(ref =>
            console.log("Table reservation details added to Database"));
    };

    const eventReservation = (agent) => {
        agent.add("Reservasi acara dapat dilakukan minimal H-2 sebelum kedatangan. Atas nama siapa kak?")
    };

    const eventReservationCostumer = (agent) => {
        const name = agent.parameters.name.name;
        const event = agent.parameters.events;
        const person = agent.parameters.person;
        const phoneNumber = agent.parameters.phonenumber;
        const date = agent.parameters.date;
        const time = agent.parameters.time;

        console.log(name);
        console.log(event);
        console.log(person);
        console.log(phoneNumber);
        console.log(date);
        console.log(time);
        agent.add(`Baik kak ${name} dengan nomor telepon ${phoneNumber}, reservasi ${event} untuk ${person} orang pada ${datePhrase} di jam ${timePhrase}. Sampai ketemu di kafe!`);
        return db.collection("eventReservation").add({
        name: name,
        event: event,
        person: person,
        phoneNumber: phoneNumber,
        date: date,
        time: time
        }).then(ref =>
            console.log("Event reservation details added to Database"));
    }
    const intentMap = new Map();
    intentMap.set('Open Hours', openHours);
    intentMap.set('Location', location);
    intentMap.set('Wi-Fi', wifi);
    intentMap.set('Promo', promo);
    intentMap.set('Smoking Area', smokingArea);
    intentMap.set('Halal', halal);
    intentMap.set('Live Music', liveMusic);
    intentMap.set('Delivery Service', deliveryService);
    intentMap.set('App Delivery', appDelivery);
    intentMap.set('Bot Delivery', botDelivery);
    intentMap.set('orderMenu', orderMenu);
    intentMap.set('fixOrder', fixOrder);
    intentMap.set('Table Reservation', tableReservation);
    intentMap.set('Table Reservation-Customer', tableReservationCostumer);
    intentMap.set('Reservasi Acara', eventReservation);
    intentMap.set('Event Reservation-Customer', eventReservationCostumer);
    agent.handleRequest(intentMap);
});

module.exports = app;