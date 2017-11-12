const socket = io();

const select = $("#select-room");
const roomName = $("input[name='room']");

socket.on("roomList", (list) => {
  if (list && list.length > 0) {
    list.forEach((room) => {
      select.append(`<option>${room}</option`);
    });
  }
});
select.change(() => {
  const selected = $("select option:selected").text();
  if (selected !== "select") {
    roomName.val(selected);
  }
});

