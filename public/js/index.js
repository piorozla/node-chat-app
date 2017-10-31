const socket = io();

socket.on("connect", () => {
  console.log("Connected to server");

  socket.emit("createMessage", {
    from: "targetUser",
    text: "text of created message",
  });
});

socket.on("disconnect", () => {
  console.log("Disconncted from server");
});

socket.on("newMessage", (message) => {
  console.log(`${message.createdAt}: New message from ${message.from}: ${message.text}`);
});
