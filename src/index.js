const express = require("express");
const app = express();

const port = 5000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, { origins: "*:*" });
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", (e) => console.log(e));
server.listen(port, () => console.log(`Server is running on port ${port}`));

io.sockets.on("connection", (socket) => {
  console.log("Connected...", socket.id);
  socket.on("login", () => {
    socket.emit("login", { status: true, socketId: socket.id });
  });
  socket.on("getConnectedClients", () => {
    socket.emit("getConnectedClients", {
      socketId: socket.id,
      clients: Object.keys(io.sockets.sockets),
    });
  });
  socket.on("offer", (id, message) => {
    io.to(id).emit("offer", socket.id, message);
  });
  socket.on("answerIceCandiate", (id, message) => {
    io.to(id).emit("answerIceCandiate", socket.id, message);
  });
  socket.on("answerLocalDescription", (id, message) => {
    io.to(id).emit("answerLocalDescription", socket.id, message);
  });
});
