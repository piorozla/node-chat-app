const socket = io();

function scrollToBottom() {
  const messages = $("#messages");
  const newMessage = messages.children("li:last-child");

  const clientHeight = messages.prop("clientHeight");
  const scrollTop = messages.prop("scrollTop");
  const scrollHeight = messages.prop("scrollHeight");
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconncted from server");
});

socket.on("newMessage", (message) => {
  const timestamp = moment(message.createdAt).format("h:mm a");
  const template = $("#message-template").html();
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: timestamp,
  });

  $("#messages").append(html);
  scrollToBottom();
});

socket.on("newLocationMessage", (message) => {
  const timestamp = moment(message.createdAt).format("h:mm a");
  const template = $("#location-message-template").html();
  const html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: timestamp,
  });

  $("#messages").append(html);
  scrollToBottom();
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

