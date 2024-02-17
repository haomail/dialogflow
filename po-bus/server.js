const http = require("http");
const app = require("./app");
const port = process.env.PORT || 6000;

const server = http.createServer(app);

const start = async () => {
    try {
        server.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(`Error⚠️ catched at: ${error}`);
    }
};

start();