const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const start = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(` Error⚠️ catched at: ${error}`);
  }
};

start();