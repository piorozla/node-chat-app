const socket = io();
let sidebarToggle = "open";

const sliderButton = $("#slider");
const sidebar = $(".chat__sidebar");
const locationButton = $("#send-location");

$(window).resize(checkWindowSize);
checkWindowSize(); // checks windows size to see if the sidebar should be open

socket.on("connect", () => {
  const params = $.deparam(window.location.search);
  socket.emit("join", params, (msg) => {
    if (msg.error) {
      alert(msg.error);
      window.location.href = "/";
    } else if (msg.roomName) {
      $("#room-name").text(msg.roomName);
    }
  });
});

socket.on("disconnect", () => {
  console.log("Disconncted from server");
});

socket.on("updateUserList", (users) => {
  const ol = $("<ol></ol>");
  users.forEach((user) => {
    ol.append($("<li></li>").text(user));
  });

  $("#users").html(ol);
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
    text: messageTextbox.val(),
  }, () => {
    messageTextbox.val("");
  });
});

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

// open/close the sidebar on slider click
sliderButton.on("click", () => {
  if (sidebarToggle === "open") {
    toggleSidebar("close");
  } else {
    toggleSidebar("open");
  }
});

sliderButton.hover(() => { sliderButton.css("opacity", "1"); }, () => { sliderButton.css("opacity", "0.4"); });

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

function checkWindowSize() {
  if (window.innerWidth < 600 && sidebarToggle === "open") {
    toggleSidebar("close");
  } else if (window.innerWidth >= 600 && sidebarToggle === "closed") {
    toggleSidebar("open");
  }
}

function toggleSidebar(action) {
  if (action === "close") {
    sidebar.animate({ "flex-basis": 0 }, 200);
    sliderButton.animate({ left: 0 }, 200, () => {
      sliderButton.html("<span>></span>")
        .mouseleave()
        .css("padding", "0.2rem 0.75rem 0.3rem 1rem");
    });
    sidebarToggle = "closed";
  } else {
    sidebar.animate({ "flex-basis": "260px" }, 200);
    sliderButton.animate({ left: "15.5rem" }, 200, () => {
      sliderButton.html("<span><</span>")
        .mouseleave()
        .css("padding", "0.2rem 0.75rem 0.3rem 0.75rem");
    });
    sidebarToggle = "open";
  }
}
