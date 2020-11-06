const jwt = require("jsonwebtoken");

const sign = (payload) => {
  return jwt.sign(payload, process.env.JWT, {
    expiresIn: "1 hours"
  });
};

const verify = (token) => {
  try {
    return jwt.verify(token, process.env.JWT);
  } catch (e) {
    return false;
  }
};

module.exports = { sign, verify}
