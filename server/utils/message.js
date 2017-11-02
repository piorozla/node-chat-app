const generateMessage = (from, text) => ({
  from,
  text,
  createdAt: new Date().getTime(),
});

const generateLocationMessage = (from, latitude, longtitude) => ({
  from,
  url: `https://www.google.com/maps?q=${latitude},${longtitude}`,
  createdAt: new Date().getTime(),
});

module.exports = { generateMessage, generateLocationMessage };
