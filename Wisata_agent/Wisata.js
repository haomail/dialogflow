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
    
    const handleFallback = async (agent) => {
        const queryText = agent.query; // Get the user's input
        // Send the user's input to OpenAI's GPT
        const gptResponse = await generateResponseFromGPT(queryText);

        // Send the GPT-generated response back to the user
        agent.add(gptResponse);
    }
});        

    // 01_pembuka
    function salam(agent) {
        const salamText = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Selamat datang",
                        "subtitle": "Halo! Selamat datang di bot panduan wisata kami. Bagaimana saya bisa membantu Anda hari ini?"
                    },
                    {
                        "type": "chips",
                        "options": [
                            {
                                "text": "Jam Buka"
                            },
                            {
                                "text": "Informasi Tiket"
                            },
                            {
                                "text": "Fasilitas di Tempat"
                            }
                        ]
                    }
                ]
            ]
        };
        agent.add(new Payload(agent.UNSPECIFIED, salamText, { sendAsMessage: true, rawPayload: true }));
    }
    
    
    // 02_penutup
    function penutup(agent) {
        const payloadData = {
            "richContent": [
                [
                    {
                        "text": "Selamat tinggal! Jika Anda memiliki pertanyaan lebih lanjut di masa depan, jangan ragu untuk bertanya. Semoga harimu menyenangkan!"
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, { sendAsMessage: true, rawPayload: true }));
    }

    // Cuaca Terkini
    function Cuaca_Terkini(agent) {
        const cuacaData = {
            "richContent": [
                [
                    {
                        "text": "Saat ini, cuaca di [Tempat] [deskripsi cuaca]. Anda bisa berencana sesuai dengan kondisi tersebut dan untuk lebih jelasnya Untuk informasi cuaca di I[ tempat ], Anda dapat mengunjungi situs web prakiraan cuaca resmi seperti Badan Meteorologi, Klimatologi, dan Geofisika (BMKG). Situs tersebut menyediakan informasi terkini mengenai cuaca di berbagai wilayah di Indonesia. Jika Anda memiliki pertanyaan lebih lanjut atau butuh bantuan lainnya, saya siap membantu!"
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, cuacaData, { sendAsMessage: true, rawPayload: true }));
    }

    // Acara dan Kegiatan
    function AcaraKegiatan(agent) {
        const acaraData = {
            "richContent": [
                [
                    {
                        "text": "Tentu! Kami secara reguler mengadakan acara seperti [Acara 1] dan [Acara 2]. Anda juga dapat menikmati kegiatan seperti [Kegiatan 1] dan [Kegiatan 2] yang di adakan setiap bulan [ jika ada ]."
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, acaraData, { sendAsMessage: true, rawPayload: true }));
    }

    // Aksesibilitas Difabel
    function  AksesibilitasDifabel(agent) {
        const difabelData = {
            "richContent": [
                [
                    {
                        "text": "Tentu! Kami sangat memperhatikan aksesibilitas dan kebutuhan khusus pengunjung. Fasilitas difabel telah kami sediakan dengan baik, termasuk toilet khusus, akses rampa, dan area parkir yang nyaman. Tim kami juga siap membantu jika ada permintaan khusus atau kebutuhan tertentu selama kunjungan. Jangan ragu untuk menghubungi kami lebih lanjut jika ada pertanyaan atau permintaan spesifik lainnya!"
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, difabelData, { sendAsMessage: true, rawPayload: true }));
    }

    // Destinasi Tertentu
    function DestinasiTertentu(agent) {
        const destinasi = "Bali"; // Ganti dengan nama destinasi yang sesuai
        const atraksiUtama = ["pantai yang indah", "budaya yang kaya", "kuliner lezat"]; // Ganti dengan atraksi utama yang sesuai
        const suasana = "santai dan ramah"; // Ganti dengan ciri khas suasana yang sesuai
        const faktorIstimewa = "keindahan alamnya dan keramahan penduduknya"; // Ganti dengan faktor-faktor istimewa yang sesuai
        const sumberInformasi = "[Nama situs web atau sumber informasi]"; // Ganti dengan sumber informasi terkait yang sesuai
    
        const DestinasiData = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": destinasi,
                        "subtitle": "Destinasi yang Mengagumkan",
                        "image": {
                            "src": {
                                "rawUrl": "https://example.com/destination_image.jpg" // Ganti dengan URL gambar destinasi
                            }
                        }
                    },
                    {
                        "type": "info",
                        "subtitle": `Selamat datang di ${destinasi}! Ini adalah destinasi yang sangat istimewa dan menarik.`,
                        "image": {
                            "src": {
                                "rawUrl": "https://example.com/welcome_image.jpg" // Ganti dengan URL gambar selamat datang
                            }
                        }
                    },
                    {
                        "type": "list",
                        "title": "Atraksi Utama",
                        "subtitle": `Beragam atraksi utama di ${destinasi} meliputi: ${atraksiUtama.join(", ")}.`
                    },
                    {
                        "type": "info",
                        "subtitle": `Nikmati suasana ${suasana} yang menjadi ciri khas ${destinasi}.`
                    },
                    {
                        "type": "info",
                        "subtitle": `Jelajahi ${destinasi} dan rasakan pengalaman tak terlupakan yang ditawarkannya.`
                    },
                    {
                        "type": "info",
                        "subtitle": `Tidak heran ${destinasi} menonjol karena ${faktorIstimewa}, membuatnya berbeda dari destinasi lainnya.`
                    },
                    {
                        "type": "info",
                        "subtitle": `Untuk informasi lebih lanjut, Anda dapat menjelajahi ${sumberInformasi} atau langsung mengunjungi ${destinasi}.`
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, DestinasiData, { sendAsMessage: true, rawPayload: true }));
    }
    

    // FAQ
    function faq(agent) {
        const faqData = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Pertanyaan Umum",
                        "subtitle": "Tentu! Beberapa pertanyaan umum termasuk:",
                        "image": {
                            "src": {
                                "rawUrl": "https://example.com/faq_image.png"
                            }
                        }
                    },
                    {
                        "type": "list",
                        "title": "FAQ 1",
                        "subtitle": "Ini adalah jawaban untuk pertanyaan FAQ 1.",
                        "image": {
                            "src": {
                                "rawUrl": "https://example.com/faq1_image.png"
                            }
                        }
                    },
                    {
                        "type": "list",
                        "title": "FAQ 2",
                        "subtitle": "Ini adalah jawaban untuk pertanyaan FAQ 2.",
                        "image": {
                            "src": {
                                "rawUrl": "https://example.com/faq2_image.png"
                            }
                        }
                    },
                    {
                        "type": "list",
                        "title": "FAQ 3",
                        "subtitle": "Ini adalah jawaban untuk pertanyaan FAQ 3.",
                        "image": {
                            "src": {
                                "rawUrl": "https://example.com/faq3_image.png"
                            }
                        }
                    },
                    {
                        "type": "info",
                        "subtitle": "Jika Anda memiliki pertanyaan lebih banyak, jangan ragu untuk bertanya."
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, faqData, { sendAsMessage: true, rawPayload: true }));
    }

    // Fasilitas di Tempat
    function FasilitasTempat(agent) {
        const fasilitasResponse = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Fasilitas Khusus",
                        "subtitle": "Kami mengutamakan kenyamanan dan keamanan semua pengunjung, termasuk mereka dengan kebutuhan khusus.",
                        "text": "Kami dengan bangga menyediakan fasilitas difabel yang lengkap, mulai dari toilet khusus, akses rampa, hingga area parkir yang nyaman. Tim kami yang ramah juga selalu siap membantu dan memenuhi permintaan khusus atau kebutuhan tertentu selama kunjungan Anda. Jangan ragu untuk menghubungi kami jika ada pertanyaan atau permintaan spesifik lainnya!"
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, fasilitasResponse, { sendAsMessage: true, rawPayload: true }));
    }
    
    // Informasi Event Mendatang
    function InformasiEventMendatang(agent) {
        const EventResponse = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Ayo Bergabung di Event!",
                        "subtitle": "Jangan sampai ketinggalan! Ada kesempatan seru menunggumu di sini. Mari ikuti [Event 1], [Event 2], dan [Event 3] bersama kami!",
                        "text": "Jangan lewatkan kesempatan untuk bergabung dalam event-event seru mendatang. Ikuti [Event 1], [Event 2], dan [Event 3] bersama kami!"
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, EventResponse, { sendAsMessage: true, rawPayload: true }));
    }
    
    // Informasi Tiket
    function InformasiTiket(agent) {
        const TiketResponse = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Info Tiket",
                        "subtitle": "Jangan lewatkan kesempatan untuk menikmati acara ini!",
                        "text": "Harga tiket bervariasi. Untuk dewasa [harga], dan untuk anak-anak [harga]. Kami menawarkan diskon untuk [kelompok tertentu]. Jangan lupa untuk melihat promo yang akan datang di website kami atau sosial media kami.",
                        "image": {
                            "src": {
                                "rawUrl": "https://example.com/image.jpg"
                            }
                        }
                    },
                    {
                        "type": "chips",
                        "options": [
                            {
                                "text": "Instagram",
                                "link": "https://www.instagram.com/wisatakulinerbogor/",
                                "image": {
                                    "src": {
                                        "rawUrl": "https://ugc.production.linktr.ee/yek3N8ISSz2PviOFANFi_q2b3e3D5AcnmFlOq?io=true&size=avatar-v1_0"
                                    }
                                }
                            },
                            {
                                "text": "Website",
                                "link": "https://linktr.ee/kamangi.id",
                                "image": {
                                    "src": {
                                        "rawUrl": "https://ugc.production.linktr.ee/yek3N8ISSz2PviOFANFi_q2b3e3D5AcnmFlOq?io=true&size=avatar-v1_0"
                                    }
                                }
                            }
                        ]
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, TiketResponse, { sendAsMessage: true, rawPayload: true }));
    }

    // InformasiTransportasi
    function InformasiTransportasi(agent) {
        const InformasiTransportasiResponse = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Informasi Transportasi",
                        "subtitle": "Ingin tahu cara terbaik untuk sampai ke [Tempat]?",
                        "text": "Tentu! Kami menyediakan berbagai opsi transportasi umum dan sarana lainnya untuk memudahkan perjalanan Anda. Anda dapat memilih antara bus, angkot, dan moda transportasi lainnya. Rinciannya dapat Anda dapatkan dengan mengecek informasi rute dan transportasi di daerah sekitar [Tempat]. Jangan ragu untuk bertanya jika Anda memiliki pertanyaan lebih lanjut atau butuh bantuan dengan rute perjalanan Anda!"
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, InformasiTransportasiResponse, { sendAsMessage: true, rawPayload: true }));
    }
    
    //Jam Buka
    function JamBuka(agent) {
        const JamBukaResponse = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Jam Operasional Kami",
                        "subtitle": "Kunjungi kami di jam yang tepat!",
                        "text": "Kami siap melayani Anda setiap hari dari pukul 09:00 pagi hingga 18:00 sore. Pintu masuk utama kami akan ditutup pada pukul 17:30. Kami merekomendasikan kunjungan Anda pada pagi hari untuk menghindari antrean panjang. Kami juga buka pada hari libur, kecuali ada pemberitahuan sebaliknya. Jadi, jangan ragu untuk datang dan nikmati pengalaman bersama kami!"
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, JamBukaResponse, { sendAsMessage: true, rawPayload: true }));
    }

    //Jelajahi Tempat
    function JelajahiTempat(agent) {
        const JelajahiTempatResponse = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Tempat Wisata Terpopuler",
                        "subtitle": "Jelajahi keberagaman dan keunikan setiap tempat!",
                        "text": "Tentu, saya bisa memberikan rekomendasi tempat wisata untuk Anda. Salah satu tempat yang sedang populer saat ini adalah [Nama Wisata]. Di sana, Anda dapat menikmati pemandangan indah, makanan lezat, serta kearifan lokal yang khas. Pastikan untuk mengeksplorasi keberagaman dan keunikan setiap tempat yang dikunjungi di bawah payung Dinasti [Nama Wisata]. Selamat menikmati perjalanan wisata Anda!",
                        "imageUrl": "https://example.com/image.jpg",
                        "imageAltText": "Gambar pemandangan di [Nama Wisata]"
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, JelajahiTempatResponse, { sendAsMessage: true, rawPayload: true }));
    }

    //Keamanan dan Aturan
    function KeamananAturan(agent) {
        const KeamananAturanResponse = {
            "richContent": [
                [
                    {
                        "type": "info",
                        "title": "Keamanan Pengunjung adalah Prioritas Kami",
                        "subtitle": "Patuhi aturan untuk menjaga keamanan bersama!",
                        "text": "Kami berkomitmen untuk menjaga keamanan pengunjung. Mohon patuhi aturan berikut ini:"
                    },
                    {
                        "type": "info",
                        "title": "Aturan 1",
                        "text": "Selalu memakai masker saat berada di area umum.",
                        "imageUrl": "https://example.com/aturan1.jpg",
                        "imageAltText": "Gambar seseorang memakai masker"
                    },
                    {
                        "type": "info",
                        "title": "Aturan 2",
                        "text": "Menjaga jarak fisik minimal 1 meter dengan pengunjung lain.",
                        "imageUrl": "https://example.com/aturan2.jpg",
                        "imageAltText": "Gambar orang-orang menjaga jarak"
                    },
                    {
                        "type": "info",
                        "title": "Aturan 3",
                        "text": "Mencuci tangan dengan sabun dan air mengalir secara teratur.",
                        "imageUrl": "https://example.com/aturan3.jpg",
                        "imageAltText": "Gambar seseorang mencuci tangan"
                    }
                ]
            ]
        };
    
        agent.add(new dfff.Payload(agent.UNSPECIFIED, KeamananAturanResponse, { sendAsMessage: true, rawPayload: true }));
    }
    

    function FinalConfirmation(agent){
        var name = agent.context.get("awaiting_name").parameters["given-name"];
        var email = agent.context.get("awaiting_email").parameters.email;

        console.log(name);
        console.log(email);
        agent.add(`Hello ${name}, your email: ${email}. We confirmed your meeting.`);
        return db.collection("meeting").add({
            name : name,
            email : email,
            time : Date.now()
        }).then(ref=>
          // fetching free slots from G-cal
            console.log("Meeting details added to DB"))
    }
    var intentMap = new Map();
    intentMap.set("Default Fallback Intent", handleFallback);
    intentMap.set('Salam',salam);
    intentMap.set('Penutup',penutup);
    intentMap.set('Cuaca Terkini',Cuaca_Terkini);
    intentMap.set('Acara dan Kegiatan', AcaraKegiatan);
    intentMap.set('Aksesibilitas Difabel', AksesibilitasDifabel);
    intentMap.set('Destinasi Tertentu', DestinasiTertentu);
    intentMap.set('FAQ', faq);
    intentMap.set('Fasilitas di Tempat', FasilitasTempat);
    intentMap.set('Informasi Event Mendatang', InformasiEventMendatang);
    intentMap.set('Informasi Transportasi', InformasiTransportasi);
    intentMap.set('Jam Buka', JamBuka);
    intentMap.set('Jelajahi Tempat', JelajahiTempat);
    intentMap.set('Keamanan dan Aturan', KeamananAturan);

    agent.handleRequest(intentMap);

app.listen(8000, ()=>console.log("Server is live at port 8000"));