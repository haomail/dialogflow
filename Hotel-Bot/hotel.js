const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');
const morgan = require('morgan')


var admin = require("firebase-admin");
var serviceAccount = require("./service-account.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Connected to DB");
} catch (error) {
  console.log("Error here" + error);
}

var db = admin.firestore();

app.use(bodyParser.json());
app.use(morgan("combined"));
app.get('/', (req, res)=>{
    res.send("We are live");
});

app.post('/', express.json(), (req, res)=>{
    const agent = new dfff.WebhookClient({
        request : req,
        response : res
    });
    
    // 01_Reservation
    function Reservation(agent){
      agent.add("Hai, silahkan lengkapi biodata ini sebelum kamu melanjutkan. Siapa nama anda?");
    }

    // 02_Confirm_Reservation
    function confirmReservation(agent){
      var name = agent.parameters.name.name;
      var email = agent.parameters.email;
      var date = agent.parameters.date;
      var dateNew = new Date(date);
      var formattedDate =  dateNew.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      console.log(name);
      console.log(email);
      console.log(date);
      console.log(formattedDate);

      agent.add(`Halo ${name}, email anda: ${email}, dan tanggal reservasi: ${formattedDate}. \nKami telah mengkonfirmasi reservasi anda. Apakah anda akan melanjutkan pemesanan?`);

      var ConfirmData = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Konfirmasi Pemesanan"
            },
            {
              "options": [
                {
                  "text": "Ya, lanjutkan reservasi!"
                },
                {
                  "text": "Tidak, saya masih belum bisa memastikannya."
                }
              ],
              "type": "chips"
            }
          ]
        ]
      };

      agent.add(new dfff.Payload(agent.UNSPECIFIED, ConfirmData, {sendAsMessage: true, rawPayload: true}));

      return db.collection("reservation").add({
        name: name,
        email: email,
        date: date
        }).then(ref =>
          console.log("Table reservation details added to Database"));
    }

    // 03_Cancel_Confirmation
    function cancelConfirmation(agent){
      agent.add("Terima kasih atas konfirmasinya. Silahkan lanjutkan keperluan anda.");
    }

    // 04_Final_Confirmation
    function finalConfirmation(agent){
      var finalData = {
          "richContent": [
            [
              {
                "title": "Metode Pemesanan",
                "subtitle": "Lanjutkan proses pemesanan kamar hotel anda disini!",
                "type": "info"
              },
              {
                "options": [
                  {
                    "link": "https://www.traveloka.com/en-id/hotel/",
                    "text": "Traveloka",
                    "image": {
                      "src": {
                        "rawUrl": "https://3.bp.blogspot.com/-BvibssNviPU/W-PDrjzXZmI/AAAAAAAAPtM/T6aiGgAzOpAiYXGPywUN7T8wWezkSa0aQCLcBGAs/s1600/Traveloka.png"
                      }
                    }
                  },
                  {
                    "image": {
                      "src": {
                        "rawUrl": "https://1.bp.blogspot.com/-nLXdsrlkAbQ/XQ-Oh-es5eI/AAAAAAAAAHo/BYKWpAqAofIicUowooD-UgenSyxldV-9wCLcBGAs/s1600/Logo%2BTiketcom%2BPNG.png"
                      }
                    },
                    "link": "https://www.tiket.com/hotel/",
                    "text": "tiket.com"
                  }
                ],
                "type": "chips"
              }
            ]
          ]
        };
        agent.add(new dfff.Payload(agent.UNSPECIFIED, finalData, {sendAsMessage: true, rawPayload: true}));
    }

    // 05_Metode_Booking
    function MetodeBooking(agent){
      var BookingData = {
        "richContent": [
          [
            {
              "type": "info",
              "subtitle": "Pemesanan Online:",
              "title": "Metode Pemesanan"
            },
            {
              "options": [
                {
                  "image": {
                    "src": {
                      "rawUrl": "https://3.bp.blogspot.com/-BvibssNviPU/W-PDrjzXZmI/AAAAAAAAPtM/T6aiGgAzOpAiYXGPywUN7T8wWezkSa0aQCLcBGAs/s1600/Traveloka.png"
                    }
                  },
                  "link": "https://www.traveloka.com/en-id/hotel/",
                  "text": "Traveloka"
                },
                {
                  "link": "https://www.LinkWebsiteHotel/",
                  "text": "Website Hotel",
                  "image": {
                    "src": {
                      "rawUrl": "https://vik.kompas.com/jkt48/assets/images/jkt48-logo.png"
                    }
                  }
                },
                {
                  "text": "tiket.com",
                  "image": {
                    "src": {
                      "rawUrl": "https://1.bp.blogspot.com/-nLXdsrlkAbQ/XQ-Oh-es5eI/AAAAAAAAAHo/BYKWpAqAofIicUowooD-UgenSyxldV-9wCLcBGAs/s1600/Logo%2BTiketcom%2BPNG.png"
                    }
                  },
                  "link": "https://www.tiket.com/hotel/"
                }
              ],
              "type": "chips"
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, BookingData, {sendAsMessage: true, rawPayload: true}));
    }

    // 06_Facilities
    function Facilities(agent){
      var FacilitiesData = {
        "richContent": [
          [
            {
              "subtitle": "Cek info selengkapnya tentang fasilitas hotel kami disini:",
              "type": "info"
            },
            {
              "options": [
                {
                  "text": "Website Hotel",
                  "image": {
                    "src": {
                      "rawUrl": "https://vik.kompas.com/jkt48/assets/images/jkt48-logo.png"
                    }
                  },
                  "link": "https://www.linkwebsitehotel/"
                },
                {
                  "link": "https://www.instagram.com/jkt48",
                  "text": "Instagram Hotel",
                  "image": {
                    "src": {
                      "rawUrl": "https://3.bp.blogspot.com/-BvibssNviPU/W-PDrjzXZmI/AAAAAAAAPtM/T6aiGgAzOpAiYXGPywUN7T8wWezkSa0aQCLcBGAs/s1600/Traveloka.png"
                    }
                  }
                },
                {
                  "link": "https://www.traveloka.com/en-id/hotel/",
                  "image": {
                    "src": {
                      "rawUrl": "https://3.bp.blogspot.com/-BvibssNviPU/W-PDrjzXZmI/AAAAAAAAPtM/T6aiGgAzOpAiYXGPywUN7T8wWezkSa0aQCLcBGAs/s1600/Traveloka.png"
                    }
                  },
                  "text": "Traveloka"
                },
                {
                  "image": {
                    "src": {
                      "rawUrl": "https://1.bp.blogspot.com/-nLXdsrlkAbQ/XQ-Oh-es5eI/AAAAAAAAAHo/BYKWpAqAofIicUowooD-UgenSyxldV-9wCLcBGAs/s1600/Logo%2BTiketcom%2BPNG.png"
                    }
                  },
                  "text": "tiket.com",
                  "link": "https://www.tiket.com/hotel/"
                }
              ],
              "type": "chips"
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, FacilitiesData, {sendAsMessage: true, rawPayload: true}));
    }

    // 07_CheckIn_Out
    function CheckIn_out(agent){
      agent.add("Check-in dimulai pada pukul [jam] dan check-out harus dilakukan sebelum pukul [jam]. \nSilakan hubungi resepsionis di [nomor handphone] jika Anda membutuhkan penyesuaian.");
    }

    // 08_Cancelled
    function Cancelled(agent){
      agent.add("Kebijakan pembatalan dapat ditemukan di situs web atau konfirmasi pusat pemesanan Anda. \nMohon cek detail pemesanan tiket anda.");
    }

    // 09_Room_Service
    function RoomService(agent){
      agent.add("Kami memiliki restoran di hotel dan juga menyediakan layanan kamar untuk kenyamanan tamu.");
    }
    
    // 10_Internet
    function Internet(agent){
      agent.add("Wi-Fi gratis dan dapat diakses di seluruh area hotel, termasuk kamar tamu. Setelah anda check-in maka anda akan diberikan password untuk wifi tersebut.");
    }

    // 11_Discount
    function Discount(agent){
      agent.add("Untuk mengetahui diskon atau promosi terkini, cek situs web hotel atau hubungi pusat pemesanan. Promo mungkin berlaku pada hari tertentu.");
      var DiscountData = {
        "richContent": [
          [
            {
              "subtitle": "Cek info promo dan diskon hote disini:",
              "type": "info"
            },
            {
              "type": "chips",
              "options": [
                {
                  "image": {
                    "src": {
                      "rawUrl": "https://vik.kompas.com/jkt48/assets/images/jkt48-logo.png"
                    }
                  },
                  "link": "https://www.linkwebsitehotel/",
                  "text": "Website Hotel"
                },
                {
                  "link": "https://www.traveloka.com/en-id/hotel/",
                  "text": "Traveloka",
                  "image": {
                    "src": {
                      "rawUrl": "https://3.bp.blogspot.com/-BvibssNviPU/W-PDrjzXZmI/AAAAAAAAPtM/T6aiGgAzOpAiYXGPywUN7T8wWezkSa0aQCLcBGAs/s1600/Traveloka.png"
                    }
                  }
                },
                {
                  "text": "tiket.com",
                  "image": {
                    "src": {
                      "rawUrl": "https://1.bp.blogspot.com/-nLXdsrlkAbQ/XQ-Oh-es5eI/AAAAAAAAAHo/BYKWpAqAofIicUowooD-UgenSyxldV-9wCLcBGAs/s1600/Logo%2BTiketcom%2BPNG.png"
                    }
                  },
                  "link": "https://www.tiket.com/hotel/"
                }
              ]
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, DiscountData, {sendAsMessage: true, rawPayload: true}));
    }

    // 12_Additional_Fee
    function AdditionalFee(agent){
      agent.add("Harga yang tercantum biasanya belum termasuk pajak dan biaya tambahan. Pastikan untuk memeriksa detail disetiap metode pembayaran sebelum konfirmasi.");
    }

    // 13_Age_Restriction
    function AgeRestriction(agent){
      agent.add("Umumnya, tamu harus berusia minimal 18 tahun untuk check-in. \nPastikan untuk memeriksa persyaratan usia pada saat pemesanan tiket pada metode pembayaran apapun.");
    }

    // 14_Changes
    function Changes(agent){
      agent.add("Silakan hubungi pusat pemesanan atau resepsionis kami dinomor [Nomor Resepsionis] untuk mendiskusikan perubahan yang diperlukan.");
    }

    // 15_Kerusakan
    function Kerusakan(agent){
      agent.add("Ya, hotel memiliki kebijakan terkait kerusakan barang di kamar. \nJika ada kerusakan yang disengaja atau kelalaian yang mengakibatkan kerusakan, hotel berhak mengenakan denda sesuai dengan biaya perbaikan atau penggantian. \nKami selalu mendorong tamu untuk memperlakukan properti hotel dengan baik dan melaporkan setiap kerusakan atau masalah kepada staf kami segera.");
    }

    // 16_LostAndFound
    function LostandFound(agent){
      agent.add("Hubungi resepsionis kami segera. Kami akan berusaha membantu Anda dengan menemukan atau mengganti barang yang tertinggal jika masih dalam hari yang sama. *Dengan syarat tertentu.");
    }

    // 17_Parkir
    function Parkir(agent){
      agent.add("Kami menyediakan fasilitas parkir dan mungkin ada biaya parkir harian. Pastikan untuk mengetahui kebijakan parkir sebelum kedatangan Anda.");
    }

    // 18_Pet
    function Pet(agent){
      agent.add("Boleh, tapi hanya hewan peliharaan tertentu saja yang diperbolehkan. Silahkan beri tahu kami jika Anda membawa hewan peliharaan. Apa hewan peliharaan anda?");
    }

    // 19_Privacy
    function Privacy(agent){
      agent.add("Kami menjaga privasi tamu dengan sangat serius. Informasi pribadi Anda dijamin keamanannya sesuai dengan kebijakan privasi kami.");
    }

    // 20_Room_Type
    function RoomType(agent){
      agent.add("Untuk mengetahui jenis kamar dan harga terkini, kunjungi pusat pemesanan.");
      var RoomTypeData = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Tipe Kamar"
            },
            {
              "options": [
                {
                  "link": "https://www.traveloka.com/en-id/hotel/",
                  "image": {
                    "src": {
                      "rawUrl": "https://3.bp.blogspot.com/-BvibssNviPU/W-PDrjzXZmI/AAAAAAAAPtM/T6aiGgAzOpAiYXGPywUN7T8wWezkSa0aQCLcBGAs/s1600/Traveloka.png"
                    }
                  },
                  "text": "Traveloka"
                },
                {
                  "link": "https://www.linkwebsitehotel/",
                  "text": "Website Hotel",
                  "image": {
                    "src": {
                      "rawUrl": "https://vik.kompas.com/jkt48/assets/images/jkt48-logo.png"
                    }
                  }
                },
                {
                  "image": {
                    "src": {
                      "rawUrl": "https://1.bp.blogspot.com/-nLXdsrlkAbQ/XQ-Oh-es5eI/AAAAAAAAAHo/BYKWpAqAofIicUowooD-UgenSyxldV-9wCLcBGAs/s1600/Logo%2BTiketcom%2BPNG.png"
                    }
                  },
                  "link": "https://www.tiket.com/hotel/",
                  "text": "tiket.com"
                }
              ],
              "type": "chips"
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, RoomTypeData, {sendAsMessage: true, rawPayload: true}));
    }

    // 21_Security
    function Security(agent){
      agent.add("Kami memiliki sistem keamanan 24 jam dan akses kamar dengan hanya menggunakan kunci.");
    }

    // 22_Strategic
    function Strategic(agent){
      agent.add("Hotel ini berjarak sekitar … dari pusat kota dan berjarak .. ke tempat wisata terkenal ..");
      var StrategicData = {
        "richContent": [
          [
            {
              "actionLink": "https://maps.app.goo.gl/iT9qj7SvzPPUd8Gp6/",
              "image": {
                "src": {
                  "rawUrl": "https://www.freeiconspng.com/uploads/location-icon-png-21.png"
                }
              },
              "type": "info",
              "subtitle": "Cek lokasi kami untuk melihat selengkapnya: "
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, StrategicData, {sendAsMessage: true, rawPayload: true}));
    }

    // 23_Transportation
    function Transportation(agent){
      agent.add("Hotel ini berjarak .. ke halte terdekat yang bisa dinaiki transportasi umum … dan berjarak … ke stasiun terdekat …");
      var TransportationData = {
        "richContent": [
          [
            {
              "actionLink": "https://maps.app.goo.gl/iT9qj7SvzPPUd8Gp6/",
              "image": {
                "src": {
                  "rawUrl": "https://www.freeiconspng.com/uploads/location-icon-png-21.png"
                }
              },
              "type": "info",
              "subtitle": "Cek lokasi kami untuk melihat selengkapnya: "
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, TransportationData, {sendAsMessage: true, rawPayload: true}));
    }

    // 24_Pet_allowed
    function PetAllowed(agent){
      agent.add("Peliharaan anda diperbolehkan untuk berada di hotel kami.");
    }

    // 25_Pet_NotAllowed
    function PetNAllowed(agent){
      agent.add("Maaf, anda tidak diperbolehkan membawa hewan tersebut ke dalam hotel kami!");
    }

    // 26_Thankfull
    function thanks(agent){
      agent.add("Dengan senang hati kami membantu anda. Selalu tanyakan kami jika ada yang anda butuhkan! ^__^");
    }

    var intentMap = new Map();

    intentMap.set('01_Reservation',Reservation);
    intentMap.set('02_Confirm_Reservation',confirmReservation);
    intentMap.set('03_Cancel_Confirmation',cancelConfirmation);
    intentMap.set('04_Final_Confirmation',finalConfirmation);
    intentMap.set('05_Metode_Booking',MetodeBooking);
    intentMap.set('06_Facilities',Facilities);
    intentMap.set('07_CheckIn_Out',CheckIn_out);
    intentMap.set('08_Cancelled',Cancelled);
    intentMap.set('09_Room_Service',RoomService);
    intentMap.set('10_Internet',Internet);
    intentMap.set('11_Discount',Discount);
    intentMap.set('12_Additional_Fee',AdditionalFee);
    intentMap.set('13_Age_Restriction',AgeRestriction);
    intentMap.set('14_Changes',Changes);
    intentMap.set('15_Kerusakan',Kerusakan);
    intentMap.set('16_LostAndFound',LostandFound);
    intentMap.set('17_Parkir',Parkir);
    intentMap.set('18_Pet',Pet);
    intentMap.set('19_Privacy',Privacy);
    intentMap.set('20_Room_Type',RoomType);
    intentMap.set('21_Security',Security);
    intentMap.set('22_Strategic',Strategic);
    intentMap.set('23_Transportation',Transportation);
    intentMap.set('24_Pet_Allowed',PetAllowed);
    intentMap.set('25_Pet_NotAllowed',PetNAllowed);
    intentMap.set('26_Thankfull',thanks);

    agent.handleRequest(intentMap);
});

app.listen(8000, ()=>console.log("Server is live at port 8000"));