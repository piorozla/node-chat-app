class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    const user = this.getUser(id);
    this.users = this.users.filter(user => user.id !== id);
    return user;
  }
  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }
  getUserByName(name) {
    return this.users.find(u => u.name.toLowerCase() === name.toLowerCase());
  }
  getUserList(room) {
    // const users = this.users.filter(user => user.room === room);
    // const namesArray = users.map(user => user.name);
    // return namesArray;
    return this.users.filter(user => user.room === room).map(user => user.name);
  }
}

module.exports = { Users };
