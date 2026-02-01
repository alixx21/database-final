const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization; // формат: "Bearer token"

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, secret);

    // кладём в req.user -> { id, role }
    req.user = payload;

    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};