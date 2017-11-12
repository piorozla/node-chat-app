const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");
const { Rooms } = require("./utils/rooms");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();
const rooms = new Rooms();

app.use(express.static(publicPath));

io.on("connect", (socket) => {
  socket.emit("roomList", rooms.getRoomList());
  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback({
        error: "Name and room name are required",
      });
    }
    if (users.getUserByName(params.name)) {
      return callback({
        error: "This name is already taken",
      });
    }
    const room = rooms.joinRoom(socket.id, params.room).name;
    // const room = params.room.toLowerCase();
    socket.join(room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, room);

    io.to(room).emit("updateUserList", users.getUserList(room));
    socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));
    socket.broadcast.to(room).emit("newMessage", generateMessage("Admin", `${params.name} has joined`));

    callback({
      roomName: room,
    });
  });

  socket.on("createMessage", (message, callback) => {

    const user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on("createLocationMessage", (coords) => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name, coords.latitude, coords.longtitude));
    }
  });

  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);

    if (user) {
      rooms.leaveRoom(socket.id, user.room);
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
