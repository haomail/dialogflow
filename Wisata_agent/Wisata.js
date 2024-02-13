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
    intentMap.set('Acara dan Kegiatan', AcaraKegiatan);
    
    agent.handleRequest(intentMap);

app.listen(8000, ()=>console.log("Server is live at port 8000"));