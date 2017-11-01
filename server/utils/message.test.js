const expect = require("expect");
const { generateMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate correct message object", () =>{
    const from = "user";
    const text = "text messgae";
    const message = generateMessage(from, text);

    expect(typeof (message.createdAt)).toBe("number");
    expect(message).toMatchObject({ from, text });
  });
});
