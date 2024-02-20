const express = require('express');
const app = express();
const dfff = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');

var admin = require("firebase-admin");
var serviceAccount = require("./stbot-f1e78-firebase-adminsdk-ih2ag-e6afe80ba2.json");

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Connected to DB");
} catch (error) {
    console.error("Error connecting to DB:", error);
    process.exit(1); 
}

var db = admin.firestore();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("We are live")
});

app.post('/', express.json(), (req, res) => {
    const agent = new WebhookClient({
        request: req,
        response: res
    });
    
        // 01_Demo
        const demo = (agent, eventName) => {
            agent.add("Halo, aku Zira yang akan menjawab pertanyaan seputar Braincore😊");
            const pengenalan = {
                "richContent": [
                    [
                        {
                            "type": "info",
                            "subtitle": "Ada sesuatu yang ingin kamu tahu dari Braincore?"
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "list",
                            "subtitle": "Klik untuk informasi lengkap tentang layanan dan produk Braincore.",
                            "title": "Informasi Layanan",
                            "event": {
                                "languageCode": "",
                                "name": "LayananBraincoreId",
                                "parameters": {}
                            }
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "list",
                            "subtitle": "Kamu bisa konsultasi dengan tim kami jika punya pertanyaan.",
                            "title": "Konsultasi",
                            "event": {
                                "name": "Cara_melakukan_Konsultasi",
                                "languageCode": "",
                                "parameters": {}
                            }
                        }
                    ]
                ]
            };
        
            if (eventName === "LayananBraincoreId") {
                LayananBraincoreId(agent);
            } else if (eventName === "Cara_melakukan_Konsultasi") {
                Cara_melakukan_Konsultasi(agent); 
            }
        
            agent.add(new Payload(agent.UNSPECIFIED, pengenalan, { sendAsMessage: true, rawPayload: true }));
        };
        
        demo(agent, "LayananBraincoreId");
            
        
          // 0_Fallback
        const handleFallback = async (agent) => {
            const queryText = agent.query; // Get the user's input
        
            // Send the user's input to OpenAI's GPT
            const gptResponse = await generateResponseFromGPT(queryText);
        
            // Send the GPT-generated response back to the user
            agent.add(gptResponse);
        };
        
          // 02_Lokasi_Braincore
        const lokasiBraincore = (agent) => {
            agent.add("Anda dapat mengunjungi kami pada alamat berikut: ");
            const lokasiData = {
            "richContent": [
                [
                {
                    "actionLink": "https://maps.app.goo.gl/HBtyegxVCoi4UiM8A",
                    "image": {
                    "src": {
                        "rawUrl": "https://braincore.id/static/images/favicon.png"
                    }
                    },
                    "type": "info",
                    "subtitle": "Lokasi Braincore"
                }
                ]
            ]
            };
            agent.add(new Payload(agent.UNSPECIFIED, lokasiData, {sendAsMessage: true, rawPayload: true}));
        }
        
          // 05_AI_sektor_pertanian
        const SektorPertanian = (agent) => {
            const PertanianData = {
            "richContent": [
                [
                {
                    "type": "accordion",
                    "title": "Jasa Konsultasi AI Braincore.id:",
                    "subtitle": "Konsultasikan projek AI dan IoT anda dalam Sektor Pertanian di Braincore.id!",
                    "image": {
                    "src": {
                        "rawUrl": "https://example.com/images/logo.png"
                    }
                    },
                    "text": "Braincore dapat membantu pengembangan AI ataupun IoT di bidang pertanian. \nBraincore memiliki tim ahli di bidang pertanian yang berpengalaman dalam mengembangkan solusi AI untuk pertanian. Konteks dan tujuan spesifik proyek tersebut dapat anda baca secara lebih jelas tentang pengembangan dibidang Pertanian anda ke contact braincore.id"
                }
                ]
            ]
            };
            agent.add(new Payload(agent.UNSPECIFIED, PertanianData, {sendAsMessage: true, rawPayload: true}));
        }
        
          // 11_Kontak_Braincore.id
        const KontakBraincore = (agent) => {
            const KontakData = {
            "richContent": [
                [
                {
                    "type": "info",
                    "title": "Kontak yang bisa anda hubungi antara lain:"
                },
                {
                    "options": [
                    {
                        "link": "https://mail.google.com/mail/?view=cm&fs=1&to=braincore.id@gmail.com",
                        "image": {
                        "src": {
                            "rawUrl": "https://www.freepnglogos.com/uploads/email-logo-png-27.png"
                        }
                        },
                        "text": "Email"
                    },
                    {
                        "link": "https://wa.me/6282125609413/",
                        "text": "WhatsApp",
                        "image": {
                        "src": {
                            "rawUrl": "https://logodownload.org/wp-content/uploads/2015/04/whatsapp-logo-1.png"
                        }
                        }
                    },
                    {
                        "image": {
                        "src": {
                            "rawUrl": "https://braincore.id/static/images/favicon.png"
                        }
                        },
                        "link": "https://maps.app.goo.gl/HBtyegxVCoi4UiM8A",
                        "text": "Alamat Braincore.id"
                    }
                    ],
                    "type": "chips"
                    }
                ]
                ]
            };agent.add(new Payload(agent.UNSPECIFIED, KontakData, {sendAsMessage: true, rawPayload: true}));
            }
        
          // 16_Tentang_Braincore.id
            const Tentang_Braincore = (agent) => {
            const BraincoreData = {
                "richContent": [
                [
                {
                    "rawUrl": "https://braincore.id/static/images/favicon.png",
                    "accessibilityText": "Braincore.id",
                    "type": "image"
                },
                {
                    "title": "Braincore.id",
                    "type": "info",
                    "subtitle": "Braincore.id adalah perusahaan teknologi yang menawarkan berbagai layanan AI, termasuk konsultasi, pengembangan, dan pembelajaran. Braincore.id berkomitmen untuk membantu masyarakat Indonesia untuk memanfaatkan potensi AI.",
                    "actionLink": "https://braincore.id/#about"
                },
                {
                    "type": "chips",
                    "options": [
                    {
                        "text": "Contact"
                    },
                    {
                        "text": "Layanan"
                    }
                    ]
                    }
                ]
                ]
            };
            agent.add(new Payload(agent.UNSPECIFIED, BraincoreData, {sendAsMessage: true, rawPayload: true}));
            }
        
          // 18_Tentang_Mitra
            const TentangMitra = (agent) => {
            const DataMitra =  {
                "richContent": [
                [
                    {
                    "rawUrl": "https://cdn.discordapp.com/attachments/1028214775949316097/1205140891665301554/image.png?ex=65d749eb&is=65c4d4eb&hm=077c3f8ea231a2442a6fd576e338d4f518a2507c4d17693826418b7df5df44e7&",
                    "accessibilityText": "Mitra Braincore.id",
                    "type": "image"
                    },
                    {
                    "title": "Mitra Braincore.id",
                    "type": "info",
                    "subtitle": "Berikut adalah beberapa mitra yang bekerja sama dengan Braincore.id. Selengkapnya bisa anda temukan pada website kami!",
                    "actionLink": "https://braincore.id/"
                    }
                ]
                ]
            };
            agent.add(new Payload(agent.UNSPECIFIED, DataMitra, {sendAsMessage: true, rawPayload: true}));
            }
          // 03_AI_Sektor_Kesehatan
            const sektorKesehatan = (agent) => {
            agent.add("Ya, Braincore dapat membantu pembangunan AI di sektor Kesehatan. Braincore memiliki tim ahli di bidang kesehatan dan kecerdasan buatan yang berpengalaman dalam mengembangkan solusi AI untuk kesehatan.")
            }
        
          // 04_AI_pengenalan_wajah
            const PengenalanWajah = (agent) => {
            agent.add("Ya, Braincore dapat membantu mengembangkan pengenalan wajah. Braincore memiliki tim ahli di bidang pengenalan wajah yang berpengalaman dalam mengembangkan solusi pengenalan wajah.")
            }
          // 06_Biaya
            const BiayaBraincore = (agent) => {
            const responsebiaya = `
        Sebelumnya Anda dapat melihat biaya pada website Braincore.id [https://braincore.id/consultation]
        
        Via Chat:
        - Rp0 (gratis selamanya)
        - Ceritakan kebutuhan proyek Anda
        - Bersama AI Consultant berpengalaman
        - Tanya jawab selama 24 jam
        
        Via Video Conference:
        - Rp150.000 per sesi
        - Bertatap muka secara virtual
        - Hands-on codingan
        - Saran terkait proyek AI
        - Best practice mengerjakan proyek AI
        - Diajarkan cara ngodingnya
        - Revisi minor 1x
        
        Custom Project:
        - Harga Spesial
        - Rancang bangun sistem AI
        - Dokumentasi proyek
        - Pembuatan arsitektur aplikasi
        - Diajarkan cara ngodingnya
        - Pengerjaan deployment ke Cloud
        - Revisi minor 3x
        
        Kurang lebih Anda bisa melihat langsung pada website Braincore pada bagian Konsultasi.
            `;
            agent.add(new Payload(agent.UNSPECIFIED, responsebiaya , {sendAsMessage: true, rawPayload: true}))
        };
          // 07_Blockchain
            const blockchain = (agent) => {
            agent.add("Bisa dong! Braincore memiliki tim ahli di bidang blockchain dan berpengalaman dalam mengembangkan solusi blockchain.")
            }
          // 08_Cancellation
            const Cancellation = (agent) => {
                const cancellationText = `
            Kebijakan pembatalan kami memungkinkan pembatalan gratis hingga sebelum waktu reservasi. Untuk pembatalan setelah waktu itu, mungkin dikenakan biaya atau lebih jelasnya Anda dapat menghubungi kontak yang ada di website Braincore.id.
            
            Anda juga dapat mengunjungi website Braincore.id untuk informasi lebih lanjut:
            `;
                const cancellationData = {
                    "richContent": [
                        [
                            {
                                "type": "info",
                                "subtitle": cancellationText
                            },
                            {
                                "options": [
                                    {
                                        "text": "Braincore.id",
                                        "image": {
                                            "src": {
                                                "rawUrl": "https://braincore.id/static/images/braincore.png"
                                            }
                                        },
                                        "link": "https://braincore.id/consultation"
                                    }
                                ],
                                "type": "chips"
                            }
                        ]
                    ]
                };
                agent.add(new Payload(agent.UNSPECIFIED, cancellationData, {sendAsMessage: true, rawPayload: true}));
            };
            
          // 09_Cara_melakukan_Konsultasi
            const Cara_melakukan_Konsultasi = (agent) => {
            const caraText = `
            Anda dapat melakukan konsultasi dengan dua cara:
        
            Melalui situs resmi Braincore.id, di mana Anda akan diarahkan untuk melakukan konsultasi. Melalui kontak yang tersedia di bawah ini:
            `;
        
            const caraData = {
                "richContent": [
                    [
                        {
                            "type": "info",
                            "subtitle": caraText
                        },
                        {
                            "options": [
                                {
                                    "image": {
                                        "src": {
                                            "rawUrl": "https://braincore.id/static/images/braincore.png"
                                        }
                                    },
                                    "link": "https://braincore.id/consultation",
                                    "text": "Konsultasi"
                                },
                                {
                                    "image": {
                                        "src": {
                                            "rawUrl": "https://braincore.id/static/images/braincore.png"
                                        }
                                    },
                                    "text": "Contact",
                                    "link": "https://braincore.id/#contact"
                                }
                            ],
                            "type": "chips"
                        }
                    ]
                ]
            };
        
            agent.add(new Payload(agent.UNSPECIFIED, caraData, {sendAsMessage: true, rawPayload: true}));
        };
        
          // 10_Jenis_Solusi_yang_ada
            const JenisSolusi = (agent) => {
            const jawabanText = `
            Braincore.id memiliki tim ahli di bidang kecerdasan buatan yang berpengalaman dalam mengembangkan berbagai solusi AI, Machine learning, IoT, Data Science, dan Robotika. Braincore.id juga menawarkan layanan konsultasi untuk membantu klien memahami kebutuhan mereka dan mengembangkan solusi yang sesuai.
            Untuk informasi lebih lanjut Anda dapat melihat di website resmi Braincore.id.
            `;
        
            const jawabanData = {
                "richContent": [
                    [
                        {
                            "type": "info",
                            "subtitle": jawabanText
                        },
                        {
                            "options": [
                                {
                                    "text": "Braincore.id",
                                    "link": "https://braincore.id/#contact",
                                    "image": {
                                        "src": {
                                            "rawUrl": "https://braincore.id/static/images/braincore.png"
                                        }
                                    }
                                }
                            ],
                            "type": "chips"
                        }
                    ]
                ]
            };
        
            agent.add(new Payload(agent.UNSPECIFIED, jawabanData, {sendAsMessage: true, rawPayload: true}));
        };

          // 11_Kontak_Braincore.id
            const Kontak_BraincoreId = (agent) => {
            const kontakText = `
            Kontak yang bisa Anda hubungi antara lain:
        
            Location:
            Jl. Letjen S. Parman No.28
        
            Email:
            braincore.id@gmail.com
        
            Call:
            +62 821 2560 9413
        
            Anda juga dapat melihat informasi lebih lanjut pada website Braincore.id di bagian contact untuk melakukan konsultasi atau menanyakan hal lainnya.
            `;
        
            agent.add(kontakText);
        };

        // 12_Layanan_dibraincore.id
        const LayananBraincoreId = (agent) => {
            const layananText = `
        - Konsultasi AI: Braincore.id menawarkan layanan konsultasi AI untuk membantu klien memahami kebutuhan mereka dan mengembangkan solusi AI yang sesuai.
        - Pengembangan AI: Braincore.id menawarkan layanan pengembangan AI untuk membantu klien membangun solusi AI dari awal hingga selesai.
        - Pembelajaran AI: Braincore.id menawarkan layanan pembelajaran AI untuk membantu klien memahami dan menguasai konsep-konsep dasar serta praktik terbaik dalam bidang kecerdasan buatan.
        
        Anda juga dapat melihat informasi lebih lanjut pada website Braincore.id di bagian layanan:
        `;
        
            const layananData = {
                "richContent": [
                    [
                        {
                            "options": [
                                {
                                    "link": "https://braincore.id/#services",
                                    "text": "Braincore.id",
                                    "image": {
                                        "src": {
                                            "rawUrl": "https://braincore.id/static/images/braincore.png"
                                        }
                                    }
                                }
                            ],
                            "type": "chips"
                        }
                    ]
                ]
            };
        
            agent.add(layananText);
            agent.add(new Payload(agent.UNSPECIFIED, layananData, { sendAsMessage: true, rawPayload: true }));
        };
        
        // 13_Pengelolaan_data
        const PengelolaanData = (agent) => {
            const pengelolaanText = `
            Ya, Braincore dapat membantu dalam pembuatan dan pengelolaan data. Braincore memiliki tim ahli di bidang data science dan kecerdasan buatan yang berpengalaman dalam mengembangkan solusi data.
        
            Proses pengelolaan data meliputi:
            
            1. Analisis kebutuhan: Braincore akan bekerja sama dengan klien untuk memahami kebutuhan mereka dan tujuan dari solusi data yang akan dikembangkan.
            
            2. Perancangan solusi: Braincore akan merancang solusi data yang memenuhi kebutuhan dan tujuan klien.
            
            3. Pengembangan solusi: Braincore akan mengembangkan solusi data dengan menggunakan teknologi data yang sesuai.
            
            4. Pengujian solusi: Braincore akan menguji solusi data untuk memastikan bahwa solusi tersebut dapat memenuhi kebutuhan dan tujuan klien.
            
            5. Peluncuran solusi: Braincore akan meluncurkan solusi data dan memberikan dukungan kepada klien.
            `;
        
            agent.add(pengelolaanText);
        };
        
        // 14_Perpisahan
        const Perpisahan = (agent) => {
            const perpisahanText = `
            Selamat tinggal! Jika Anda memiliki pertanyaan lain di masa mendatang, jangan ragu untuk bertanya. Semoga hari Anda menyenangkan!`;
        
            agent.add(perpisahanText);
        };
        
          // 15_Robotika
            const robotika = (agent) => {
            const robotikaResponse = {
                "richContent": [
                [
                    {
                    "type": "info",
                    "subtitle": "Tentu saja! Braincore memiliki tim ahli di bidang robotika dan IoT yang berpengalaman dalam mengembangkan solusi robotika. Klik pesan ini jika anda ingin berkonsultasi lebih lanjut tentang proyek robotika anda.",
                    "actionLink": "https://braincore.id/#contact"
                    }
                ]
                ]
            }
            agent.add(new Payload(agent.UNSPECIFIED, robotikaResponse, {sendAsMessage: true, rawPayload: true}))
            }

          // 17_Tentang_Braincore.id
        const SyaratMelakukanKonsultasi = (agent) => {
            const syaratText = `
            Untuk melakukan konsultasi AI dengan Braincore.id, Anda perlu menyiapkan informasi tentang:
        
            1. Kebutuhan Anda.
            2. Informasi yang perlu disiapkan.
            3. Tujuan penggunaan AI.
            4. Data yang tersedia.
            5. Kemampuan yang dibutuhkan.
            6. Batas waktu dan anggaran.
        
            Jika masih kurang Anda bisa langsung menghubungi kontak Braincore.id.
            `;
        
            agent.add(syaratText);
        };
          // 19_Text_Mining
            const textMining =(agent) => {
            agent.add("Ya, Braincore dapat membantu pembuatan Text Mining. Braincore memiliki tim ahli di bidang Text Mining yang berpengalaman dalam mengembangkan solusi Text Mining.")
            }

        // 20_Waktu_Konsultasi
        const WaktuKonsultasi = (agent) => {
            const responseText = `
            Tentu! Kami menyediakan berbagai pilihan durasi konsultasi AI bersama Braincore, yang dapat disesuaikan dengan kebutuhan Anda. Silakan hubungi tim kami untuk mendapatkan informasi lebih lanjut dan menjadwalkan sesi konsultasi yang sesuai dengan jadwal Anda.
            `;
            
            const responsePayload = {
                "richContent": [
                    [
                        {
                            "type": "info",
                            "subtitle": responseText
                        },
                        {
                            "options": [
                                {
                                    "text": "Contact",
                                    "link": "https://braincore.id/#contact"
                                }
                            ],
                            "type": "chips"
                        }
                    ]
                ]
            };
            agent.add(new Payload(agent.UNSPECIFIED, responsePayload, {sendAsMessage: true, rawPayload: true}));
        };
        
          // 21_Waktu_Pengembangan_AI
            const waktuPengembangan = (agent) => {
            const development = {
                "richContent": [
                [
                    {
                    "type": "info",
                    "title": "Pengembangan Solusi AI",
                    "subtitle": "Jenis solusi AI yang berbeda membutuhkan waktu yang berbeda untuk dikembangkan. Klik pesan ini jika anda ingin berkonsultasi tentang proyek anda.",
                    "actionLink": "https://braincore.id/#contact"
                    }
                    ]
                ]
            }
            agent.add(new Payload(agent.UNSPECIFIED, development, {sendAsMessage: true, rawPayload: true}))
            agent.add("Apakah Braincore dapat membantu untuk mengembangan Pengenalan wajah?")
            }
        

    // Penanganan intent lainnya

    const intentMap = new Map();
    intentMap.set("01_Welcome", demo);
    intentMap.set("0_Fallback", handleFallback);
    intentMap.set("02_Lokasi_Braincore", lokasiBraincore);
    intentMap.set("03_AI_Sektor_Kesehatan", sektorKesehatan);
    intentMap.set("04_AI_pengenalan_wajah", PengenalanWajah);
    intentMap.set("05_AI_sektor_pertanian", SektorPertanian);
    intentMap.set("06_Biaya", BiayaBraincore);
    intentMap.set("07_Blockchain", blockchain);
    intentMap.set("08_Cancellation", Cancellation);
    intentMap.set("09_Cara_melakukan_Konsultasi", Cara_melakukan_Konsultasi);
    intentMap.set("10_Jenis_Solusi_yang_ada", JenisSolusi);
    intentMap.set("11_Kontak_Braincore.id", Kontak_BraincoreId);
    intentMap.set("12_Layanan_dibraincore.id", LayananBraincoreId);
    intentMap.set("13_Pengelolaan_data", PengelolaanData);
    intentMap.set("14_Perpisahan", Perpisahan);
    intentMap.set("15_Robotika", robotika);
    intentMap.set("16_Tentang_Braincore.id", Tentang_Braincore);
    intentMap.set("17_Syarat_melakukan_Konsultasi", SyaratMelakukanKonsultasi);
    intentMap.set("18_Tentang_Mitra", TentangMitra);
    intentMap.set("19_Text_Mining", textMining);
    intentMap.set("20_Waktu_Konsultasi", WaktuKonsultasi);
    intentMap.set("21_Waktu_Pengembangan_AI", waktuPengembangan);
    // Tambahkan pemetaan intent lainnya di sini
    
    agent.handleRequest(intentMap);

});

app.listen(3333, ()=>console.log("Server is live at port 3333"));
