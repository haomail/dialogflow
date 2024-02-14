const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.send("We are live")
});

app.post('/', express.json(), (req, res)=>{
    const agent = new dfff.WebhookClient({
        request : req,
        response : res
    });

    // 01_Assurance
    function Assurance(agent){
      agent.add("Ya, kami menyediakan opsi asuransi perjalanan untuk melindungi Anda dari kemungkinan kejadian yang tidak terduga selama liburan.");
      var AssuranceData = {
        "richContent": [
          [
            {
              "title": "Asuransi Pelanggan",
              "type": "info",
              "image": {
                      "src": {
                        "rawUrl": "https://example.com/asuransi.png"
                      }
                    },
              "actionLink": "https://LinkKeInformasiAsuransi.com"
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, AssuranceData, {sendAsMessage: true, rawPayload: true}));
    }

    // 02_Cancelled_Payment
    function Cancelled_Payment(agent){
      agent.add("Kebijakan pembatalan bervariasi tergantung pada jenis paket dan penyedia layanan. \nKami akan memberikan informasi lengkap mengenai kebijakan tersebut sebelum Anda melakukan pemesanan.");
    }

    // 03_Claim_Assurance
    function Claim_Assurance(agent){
      agent.add("Kami akan memberikan panduan langkah demi langkah mengenai \nproses klaim asuransi perjalanan saat anda selesai melakukan pembayaran pemesanan paket perjalanan. \nPastikan untuk menyimpan salinan dokumen penting selama perjalanan.");
    }

    // 04_Discount
    function Discount(agent){
      agent.add("Kami sering menawarkan diskon atau promosi tertentu. \nPastikan untuk memeriksa situs web atau instagram kami \natau bertanya kepada agen perjalanan kami mengenai penawaran terkini.");
      var DiscountData = {
        "richContent": [
          [
            {
             "options": [
                      {
                        "text": "Website",
                        "image": {
                          "src": {
                            "rawUrl": "https://example.com/images/website.png"
                          }
                        },
                        "link": "https://website.com"
                      },
                      {
                        "image": {
                          "src": {
                            "rawUrl": "https://www.freeiconspng.com/uploads/location-icon-png-21.png"
                          }
                        },
                        "text": "Alamat Agent Travel",
                        "link": "https://maps.app.goo.gl/AlamatAgentTravel/"
                      }
                    ],
              "type": "chips"
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, DiscountData, {sendAsMessage: true, rawPayload: true}));
    }

    // 05_Information
    function Information(agent){
      agent.add("Kami akan memberikan informasi dan bantuan terkait persyaratan visa untuk destinasi yang akan Anda kunjungi. \nPastikan untuk memeriksa persyaratan ini dengan cermat.");
    }

    // 06_Makan
    function Makan(agent){
      agent.add("Biaya makanan dapat termasuk atau tidak tergantung pada jenis paket. Ini akan dijelaskan dalam rincian paket. Beberapa paket mungkin termasuk sarapan atau makan malam tertentu.");
    }

    // 07_Package
    function Package(agent){
      var PackageData = {
        "richContent": [
          [
            {
              "subtitle": "Lanjutkan proses pemesanan paket perjalanan anda disini:",
              "type": "info",
              "title": "Metode Pemesanan"
            },
            {
              "options": [
                      {
                        "image": {
                          "src": {
                            "rawUrl": "https://logodix.com/logo/1995146.png"
                          }
                        },
                        "text": "Paket Tipe A",
                        "link": "https://www.PaketA/"
                      },
                      {
                        "text": "Paket Tipe B",
                        "image": {
                          "src": {
                            "rawUrl": "https://vik.kompas.com/jkt48/assets/images/jkt48-logo.png"
                          }
                        },
                        "link": "https://www.PaketB/"
                      },
                      {
                        "link": "https://maps.app.goo.gl/AlamatAgentTravel/",
                        "text": "Alamat Hotel",
                        "image": {
                          "src": {
                            "rawUrl": "https://www.freeiconspng.com/uploads/location-icon-png-21.png"
                          }
                        }
                      }
                    ],
              "type": "chips"
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, PackageData, {sendAsMessage: true, rawPayload: true}));
    }

    // 08_Package_Needs
    function Package_Needs(agent){
      agent.add("Ya, kami dapat membantu menyesuaikan paket liburan sesuai preferensi Anda. \nHubungi agen perjalanan dinomor [nomor CS] kami untuk mendiskusikan opsi penyesuaian.");
    }

    // 09_Payment
    function Payment(agent){
      agent.add("Ya, kami menyediakan opsi pembayaran cicilan untuk beberapa paket liburan. \nHubungi agen perjalanan kami untuk mendiskusikan opsi pembayaran.");
      var PaymentData = {
        "richContent": [
          [
            {
              "options": [
                      {
                        "image": {
                          "src": {
                            "rawUrl": "https://example.com/images/website.png"
                          }
                        },
                        "text": "Website",
                        "link": "https://website.com"
                      },
                      {
                        "text": "Alamat Agent Travel",
                        "link": "https://maps.app.goo.gl/AlamatAgentTravel/",
                        "image": {
                          "src": {
                            "rawUrl": "https://www.freeiconspng.com/uploads/location-icon-png-21.png"
                          }
                        }
                      }
                    ],
              "type": "chips"
           }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, PaymentData, {sendAsMessage: true, rawPayload: true}));
    }

    // 10_Problems
    function Problems(agent){
      agent.add("Kami menyediakan nomor darurat yang dapat dihubungi selama perjalanan. \nSelain itu, agen perjalanan kami akan memberikan informasi kontak penting sebelum keberangkatan. \nOleh karena itu, harap diperhatikan baik-baik.");
    }

    // 11_Public_Transportation
    function Public_Transportation(agent){
      agent.add("Kami akan memberikan informasi tentang sistem transportasi umum di destinasi Anda, \ntermasuk tiket, jadwal, dan rute sebelum anda melakukan perjalanan dan anda bisa bertanya \npada layanan pelanggan kami di nomor-nomor yang telah kami berikan.");
    }

    // 12_Refund
    function Refund(agent){
      agent.add("Kebijakan refund bervariasi tergantung pada jenis paket dan penyedia layanan. \nKami akan memberikan informasi lengkap sebelum Anda melakukan pemesanan.");
    }

    // 13_Rental
    function Rental(agent){
      agent.add("Kami dapat membantu mengatur penyewaan mobil motor atau memberikan informasi tentang transportasi lokal.");
    }

    // 14_Safety
    function Safety(agent){
      agent.add("Kami akan memberikan informasi terkini tentang situasi keamanan di destinasi Anda. \nSelalu periksa sumber informasi resmi dan peringatan perjalanan sebelum berangkat.");
    }

    // 15_Services
    function Services(agent){
      agent.add("Ya, kami menyediakan layanan dukungan pelanggan 24 jam untuk membantu Anda selama perjalanan. Silahkan hubungi CS kami untuk keperluan anda sebagai berikut (Nomor CS)");
    }

    // 16_Testimoni
    function Testimoni(agent){
      agent.add("Anda dapat memberikan umpan balik atau testimonial melalui situs web kami atau berkomunikasi langsung dengan agen perjalanan kami setelah perjalanan selesai.");
    }

    // 17_Ticketing
    function Ticketing(agent){
      agent.add("Kami dapat membantu Anda memesan tiket acara atau atraksi wisata di destinasi Anda. \nHubungi agen perjalanan kami untuk informasi lebih lanjut.");
      var TicketingData = {
        "richContent": [
          [
            {
             "options": [
                      {
                        "text": "Website",
                        "link": "https://website.com",
                        "image": {
                          "src": {
                            "rawUrl": "https://example.com/images/website.png"
                          }
                        }
                      },
                      {
                        "image": {
                          "src": {
                            "rawUrl": "https://1.bp.blogspot.com/-q2bRT64Dafg/Xut23KhrJ_I/AAAAAAAAGGc/m1PEYlvsIak3XDIVQypkjqqJ8J8qUj7wwCLcBGAsYHQ/s1600/logo-wa.png"
                          }
                        },
                        "link": "https://wa.me/noTELP/",
                        "text": "Call Center Agent Travel"
                      }
                    ],
              "type": "chips"
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, TicketingData, {sendAsMessage: true, rawPayload: true}));
    }

    // 18_Weather
    function Weather(agent){
      agent.add("Kami akan memberikan informasi cuaca terbaru untuk destinasi Anda. \nAnda juga dapat memeriksa situs web cuaca atau aplikasi seluler yang dapat memberikan perkiraan cuaca secara real-time.");
      var WeatherData = {
        "richContent": [
          [
            {
              "title": "Cek Cuaca Terkini!",
              "type": "info",
              "image": {
                        "src": {
                          "rawUrl": "https://cdn.icon-icons.com/icons2/1860/PNG/512/cloudy_118029.png"
                        }
                      },
              "actionLink": "https://www.accuweather.com/en/id/national/weather-radar"
            }
          ]
        ]
     };
    agent.add(new dfff.Payload(agent.UNSPECIFIED, WeatherData, {sendAsMessage: true, rawPayload: true}));
    }
    
    // 19_Variation_Package
    function Variation_Package(agent){
      agent.add("Kami memiliki berbagai paket liburan yang bisa anda pilih.");
      var VarData = {
        "richContent": [
          [
            {
              "type": "info",
              "title": "Paket Wisata"
            },
            {
             "type": "chips",
             "options": [
                      {
                        "text": "Paket Tipe A!"
                      },
                      {
                        "text": "Paket Tipe B!"
                      }
              ]
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, VarData, {sendAsMessage: true, rawPayload: true}));
    }

    // 20_TipeB
    function TipeB(agent){
      var Bdata = {
        "richContent": [
          [
           {
            "rawUrl": "https://vik.kompas.com/jkt48/assets/images/jkt48-logo.png",
            "accessibilityText": "Paket Tipe B",
            "type": "image"
           },
           {
            "title": "Tipe B",
            "text": [
                    "1) Paket wisata [nama tempat] dan [nama tempat], sarapan, dan hotel selama 2 hari 3 malam seharga [harga]",
                    "2) Paket wisata [nama tempat] dan [nama tempat], sarapan, dan hotel selama 3 hari 4 malam seharga [harga]"
                    ],
                    "type": "description"
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, Bdata, {sendAsMessage: true, rawPayload: true}));
    }

    // 21_TipeA
    function TipeA(agent){
      var Adata  = {
        "richContent": [
          [
            {
              "accessibilityText": "Paket Tipe A",
              "type": "image",
              "rawUrl": "https://vik.kompas.com/jkt48/assets/images/jkt48-logo.png"
            },
            {
              "text": [
                      "1) Paket wisata [nama tempat], sarapan, dan hotel selama 1 hari 2 malam seharga [harga]",
                      "2) Paket wisata [nama tempat], sarapan, dan hotel selama 2 hari 3 malam seharga [harga]"
                      ],
              "type": "description",
              "title": "Tipe A"
            }
          ]
        ]
      };
      agent.add(new dfff.Payload(agent.UNSPECIFIED, Adata, {sendAsMessage: true, rawPayload: true}));
    }

    // 22_Lost_and_Found
    function Lost_and_Found(agent){
      agent.add("Hubungi agen perjalanan kami atau sumber informasi darurat yang disediakan sebelumnya. \nKami akan memberikan bantuan untuk mengatasi masalah ini. \n*Dengan ketentuan agensi travel");
    }

    var intentMap = new Map();

    intentMap.set('01_Assurance',Assurance);
    intentMap.set('02_Cancelled_Payment',Cancelled_Payment);
    intentMap.set('03_Claim_Assurance',Claim_Assurance);
    intentMap.set('04_Discount',Discount);
    intentMap.set('05_Information',Information);
    intentMap.set('06_Makan',Makan);
    intentMap.set('07_Package',Package);
    intentMap.set('08_Package_Needs',Package_Needs);
    intentMap.set('09_Payment',Payment);
    intentMap.set('10_Problems',Problems);
    intentMap.set('11_Public_Transportation',Public_Transportation);
    intentMap.set('12_Refund',Refund);
    intentMap.set('13_Rental',Rental);
    intentMap.set('14_Safety',Safety);
    intentMap.set('15_Services',Services);
    intentMap.set('16_Testimoni',Testimoni);
    intentMap.set('17_Ticketing',Ticketing);
    intentMap.set('18_Weather',Weather);
    intentMap.set('19_Variation_Package',Variation_Package);
    intentMap.set('20_TipeB',TipeB);
    intentMap.set('21_TipeA',TipeA);
    intentMap.set('22_Lost_and_Found',Lost_and_Found);

    agent.handleRequest(intentMap);
});

app.listen(8000, ()=>console.log("Server is live at port 8000"));