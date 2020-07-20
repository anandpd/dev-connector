const router = require("express").Router();
const { LoginValidation } = require("../../validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const { verifyToken } = require("../../middleware/auth");


router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error !!");
  }
});

router.post("/", async (req, res) => {
  const { error } = LoginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { email, password } = req.body;
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    let invalidMessage = "Invalid Credentials";

    if (!user) return res.status(400).json({ message: invalidMessage });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: invalidMessage });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, require("config").get("secretToken"), {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
