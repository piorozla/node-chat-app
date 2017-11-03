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
  $("#messages").append(li);
});

socket.on("newLocationMessage", (message) => {
  const li = $("<li></li>");
  const a = $("<a target='_blank'>My current location</a>");

  li.text(`${message.from}:`);
  a.attr("href", message.url);
  li.append(a);
  $("#messages").append(li);
});

$("#message-form").on("submit", (e) => {
  e.preventDefault();

  const messageTextbox = $("[name=message]");

  socket.emit("createMessage", {
    from: "User",
    text: messageTextbox.val(),
  }, () => {
    messageTextbox.val("");
  });
});

const locationButton = $("#send-location");

locationButton.on("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser");
  }
  locationButton.attr("disabled", "disabled").text("Sending..");

  navigator.geolocation.getCurrentPosition((position) => {
    locationButton.removeAttr("disabled").text("Send Location");
    socket.emit("createLocationMessage", {
      latitude: position.coords.latitude,
      longtitude: position.coords.longitude,
    });
  }, () => {
    alert("Unable to fetch location");
    locationButton.removeAttr("disabled").text("Send Location");
  });
});

