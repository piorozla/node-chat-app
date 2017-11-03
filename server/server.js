const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connect", (socket) => {
  console.log("New user connected");

  socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));

  socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined"));

  socket.on("createMessage", (message, callback) => {
    console.log(`New message to ${message.from}: ${message.text}`);
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback();
  });

  socket.on("createLocationMessage", (coords) => {
    io.emit("newLocationMessage", generateLocationMessage("Admin", coords.latitude, coords.longtitude));
  });

  socket.on("disconnect", () => {
    console.log("User disconncted from server");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
