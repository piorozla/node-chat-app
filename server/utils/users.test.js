const expect = require("expect");
const { Users } = require("./users");

describe("Users", () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: "1",
      name: "Mike",
      room: "Node Course",
    }, {
      id: "2",
      name: "Jane",
      room: "React Course",
    }, {
      id: "3",
      name: "Peter",
      room: "Node Course",
    }];
  });

  it("should add new user", () => {
    const tempUsers = new Users();
    const user = {
      id: "123",
      name: "Peter",
      room: "Test room",
    };
    const resUser = tempUsers.addUser(user.id, user.name, user.room);

    expect(tempUsers.users).toEqual([user]);
  });

  it("should remove a user", () => {
    const user = users.removeUser("1");

    expect(user).toEqual({
      id: "1",
      name: "Mike",
      room: "Node Course",
    });
    expect(users.users.length).toBe(2);
  });

  it("should not remove a user if id is wrong", () => {
    const user = users.removeUser("4");

    expect(user).toBeFalsy();
  });

  it("should find user", () => {
    const user = users.getUser("1");

    expect(user).toEqual({
      id: "1",
      name: "Mike",
      room: "Node Course",
    });
  });

  it("should not find user if id is wrong", () => {
    const user = users.getUser("4");

    expect(user).toBeFalsy();
  });

  it("should return names for Node course", () => {
    const userList = users.getUserList("Node Course");

    expect(userList).toEqual(["Mike", "Peter"]);
  });

  it("should return names for React course", () => {
    const userList = users.getUserList("React Course");

    expect(userList).toEqual(["Jane"]);
  });
});
