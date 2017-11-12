const expect = require("expect");
const { Rooms } = require("./rooms");

describe("Rooms", () => {
  let rooms;
  beforeEach(() => {
    rooms = new Rooms();
    rooms.rooms = [
      {
        name: "Master",
        users: [2],
        permanent: true,
      }, {
        name: "Node",
        users: [1],
        permanent: false,
      },
    ];
  });
  it("should create room if it doesn't exist on join", () => {
    const r = rooms.joinRoom(1, "newRoom");
    expect(rooms.rooms.length).toBe(3);
    expect(rooms.rooms[2].name).toBe("newRoom");
    expect(rooms.rooms[2].users.length).toBe(1);
    expect(r).toEqual(rooms.rooms[2]);
  });
  it("should join existing room if possible", () => {
    const r = rooms.joinRoom(1, "nOde");
    expect(rooms.rooms.length).toBe(2);
    expect(r.name).toBe("Node");
    expect(r.users.length).toBe(2);
  });
  it("should remove room if not permanent on leave", () => {
    const r = rooms.leaveRoom(1, "nOde");
    expect(r).toBeFalsy();
    expect(rooms.rooms.length).toBe(1);
  });
  it("should not remove room if permanent on leave", () => {
    const r = rooms.leaveRoom(2, "master");
    expect(r).toBeFalsy();
    expect(rooms.rooms.length).toBe(2);
    expect(rooms.rooms[0].users.length).toBe(0);
  });
  it("should not remove room if not empty", () => {
    const r = rooms.leaveRoom(1, "master");
    expect(r).toEqual(rooms.rooms[0]);
  });
  it("should get list of rooms", () => {
    const r = rooms.getRoomList();
    expect(r.length).toBe(2);
  });
});
