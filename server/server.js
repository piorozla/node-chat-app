const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connect", (socket) => {
  console.log("New user connected");

  socket.on("createMessage", (message) => {
    console.log(`New message to ${message.from}: ${message.text}`);
    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconncted from server");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
