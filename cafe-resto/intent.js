const dfff = require('dialogflow-fulfillment');
const { db } = require('./firebase');

function openHours(agent){
    agent.add("Kami buka dari [Jam Buka] hingga [Jam Tutup] setiap hari. Apakah ada yang lain yang dapat kami bantu?");
  }
  function location(agent){
    agent.add("[Nama Kafe/Restoran] terletak di [lokasi]. Kami berharap dapat menyambut Anda segera!");
  }
  function wifi(agent){
    agent.add("Ya, kami menyediakan layanan Wi-Fi gratis untuk para pelanggan kami. Anda dapat mendapatkan kata sandi di kasir.");
  }
  function promo(agent){
    agent.add("Kami memiliki beberapa promo dan diskon spesial. Untuk informasi terbaru, silakan kunjungi halaman promo di situs web kami.");
  }
  function smokingArea(agent){
    agent.add("Tentu, kami menyediakan ruangan untuk merokok beserta dengan asbaknya.");
  }
  function halal(agent){
    agent.add("Kami menggunakan bahan-bahan berkualitas yang diolah secara halal. Kami juga sudah memperoleh sertifikat Halal dari MUI dengan nomor [ID]");
  }
  function liveMusic(agent){
    agent.add("Kami sering mengadakan pertunjukan musik langsung. Untuk jadwal acara terbaru, silakan cek situs web kami atau tanyakan kepada staf kami.");
  }
  function deliveryService(agent){
    var deliveryData = {
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
  }
  function appDelivery(agent){
    var appData = {
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
  function botDelivery(agent){
    agent.add("Baik dengan kakak siapa ya namanya?")
  }
  /*
  function botDeliveryCostumer(agent){
    var nama = agent.parameters.name.name;
    var telepon = agent.parameters.phonenumber;
    var alamat = agent.parameters.location.address;
    console.log(nama);
    console.log(telepon);
    console.log(alamat);
    
  } */
  function orderMenu(agent){
    var displayMenu = {
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
    } 

  function fixOrder(agent){
    var nama = agent.context.get("data_costumer").parameters.person.name;
    var telepon = agent.context.get("data_costumer").parameters["phone-number"];
    var alamat = agent.context.get("data_costumer").parameters.location["street-address"];
    var pesanan = agent.context.get("choose_menu").parameters.menu;
    var jumlah = agent.context.get("choose_menu").parameters.quantity;

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
      }
  
  function tableReservation(agent){
    agent.add("Reservasi meja dapat dilakukan minimal 1 jam sebelum kedatangan. Atas nama siapa kak?")
  }
  function tableReservationCostumer(agent){
    var name = agent.parameters.name.name;
    var person = agent.parameters.person;
    var phoneNumber = agent.parameters.phonenumber;
    var datePhrase = agent.parameters.date;
    var timePhrase = agent.parameters.time;
    let dateTime = convertToFormattedDateTime(datePhrase, timePhrase);

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
  }
  function eventReservation(agent){
    agent.add("Reservasi acara dapat dilakukan minimal H-2 sebelum kedatangan. Atas nama siapa kak?")
  }
  function eventReservationCostumer(agent){
    var name = agent.parameters.name.name;
    var event = agent.parameters.events;
    var person = agent.parameters.person;
    var phoneNumber = agent.parameters.phonenumber;
    var date = agent.parameters.date;
    var time = agent.parameters.time;

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

module.exports = {
    openHours,
    location,
    wifi,
    promo,
    smokingArea,
    halal,
    liveMusic,
    deliveryService,
    appDelivery,
    botDelivery,
    orderMenu,
    fixOrder,
    tableReservation,
    tableReservationCostumer,
    eventReservation,
    eventReservationCostumer
}
