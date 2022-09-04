const app = require("./app");
const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
