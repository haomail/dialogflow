const express = require('express');
const bodyParser = require('body-parser');
const dfff = require('dialogflow-fulfillment');
const homeRoute = require('./homeroute');
const intentFunctions = require('./intent');

const PORT = 4444;

homeRoute.post('/', express.json(), (req, res) => {
  const agent = new dfff.WebhookClient({
    request: req,
    response: res
  });

  // Create a map to associate intent names with their corresponding functions
  const intentMap = new Map();
  intentMap.set('Open Hours', intentFunctions.openHours);
  intentMap.set('Location', intentFunctions.location);
  intentMap.set('Wi-Fi', intentFunctions.wifi);
  intentMap.set('Promo', intentFunctions.promo);
  intentMap.set('Smoking Area', intentFunctions.smokingArea);
  intentMap.set('Halal', intentFunctions.halal);
  intentMap.set('Live Music', intentFunctions.liveMusic);
  intentMap.set('Delivery Service', intentFunctions.deliveryService);
  intentMap.set('App Delivery', intentFunctions.appDelivery);
  intentMap.set('Bot Delivery', intentFunctions.botDelivery);
  intentMap.set('orderMenu', intentFunctions.orderMenu);
  intentMap.set('fixOrder', intentFunctions.fixOrder);
  intentMap.set('Table Reservation', intentFunctions.tableReservation);
  intentMap.set('Table Reservation-Customer', intentFunctions.tableReservationCostumer);
  intentMap.set('Reservasi Acara', intentFunctions.eventReservation);
  intentMap.set('Event Reservation-Customer',intentFunctions.eventReservationCostumer);
  agent.handleRequest(intentMap);
});

homeRoute.listen(PORT, () => console.log(`Server is live at port ${PORT}`));
