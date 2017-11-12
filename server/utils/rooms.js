class Rooms {
  constructor() {
    this.rooms = [
      {
        name: "Master",
        users: [],
        permanent: true,
      },
    ];
  }
  joinRoom(userId, roomName) {
    const room = this.rooms.find(r => r.name.toLowerCase() === roomName.toLowerCase());
    if (room) {
      Object.values(this.rooms).forEach((r) => {
        if (r.name.toLowerCase() === roomName.toLowerCase()) {
          r.users.push(userId);
        }
      });
      return room;
    }

    const r = {
      name: roomName,
      users: [userId],
      permanent: false,
    };
    this.rooms.push(r);
    return r;
  }
  leaveRoom(userId, roomName) {
    let roomIsEmpty = false;
    let room;
    Object.values(this.rooms).forEach((r) => {
      if (r.name.toLowerCase() === roomName.toLowerCase()) {
        const index = r.users.indexOf(userId);
        if (index >= 0) {
          r.users.splice(index, 1);
        }
        if (r.users.length === 0) {
          roomIsEmpty = true;
          if (!r.permanent) {
            this.rooms.splice(this.rooms.indexOf(r), 1);
          }
        } else {
          room = r;
        }
      }
    });
    if (!roomIsEmpty) {
      return room;
    }
  }
  getRoomList() {
    return this.rooms.map(r => r.name);
  }
  getRoom(roomName) {
    return this.rooms.find(r => r.name.toLowerCase() === roomName.toLowerCase());
  }
}

module.exports = { Rooms };
