const expect = require("expect");
const { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate correct message object", () =>{
    const from = "user";
    const text = "text messgae";
    const message = generateMessage(from, text);

    expect(typeof (message.createdAt)).toBe("number");
    expect(message).toMatchObject({ from, text });
  });
});

describe("generateLocationMessage", () => {
  it("should generate correct location object", () => {
    const from = "user";
    const longtitude = 1;
    const latitude = 1;
    const url = `https://www.google.com/maps?q=${latitude},${longtitude}`;
    const message = generateLocationMessage(from, latitude, longtitude);

    expect(typeof (message.createdAt)).toBe("number");
    expect(message).toMatchObject({ from, url });
  });
});
