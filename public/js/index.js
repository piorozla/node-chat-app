const socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconncted from server");
});

socket.on("newMessage", (message) => {
  const li = $("<li></li>");
  li.text(`${message.from}: ${message.text}`);
  $("#messages").prepend(li);
});

$("#message-form").on("submit", (e) => {
  e.preventDefault();

  socket.emit("createMessage", {
    from: "User",
    text: $("[name=message]").val(),
  }, () => {

  });
});

