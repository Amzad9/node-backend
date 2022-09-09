const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 7000;

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origins: [
      "http://localhost:4200",
    ],
  },
});

io.on("connection", (socket) => {});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

app.set("socketio", io); // <== this line

process.on("warning", (e) => console.warn(e.stack));
process.on("error", (e) => console.error(e.stack));


