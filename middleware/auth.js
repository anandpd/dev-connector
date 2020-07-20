const jwt = require("jsonwebtoken");
const secretToken = require("config").get("secretToken");

module.exports.verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ message: "No Authorization !!" });
  try {
    const verified = jwt.verify(token, secretToken);
    req.user = verified.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid !!" });
  }
};
