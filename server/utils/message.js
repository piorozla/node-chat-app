const moment = require("moment");

const generateMessage = (from, text) => ({
  from,
  text,
  createdAt: moment().valueOf(),
});

const generateLocationMessage = (from, latitude, longtitude) => ({
  from,
  url: `https://www.google.com/maps?q=${latitude},${longtitude}`,
  createdAt: moment().valueOf(),
});

module.exports = { generateMessage, generateLocationMessage };
