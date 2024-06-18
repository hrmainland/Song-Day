const generateGameCode = () => {
  // Generate a random string of characters
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 3; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Add a timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36);

  // Concatenate the random code and timestamp
  code += timestamp;

  return code;
};

module.exports = generateGameCode;
