const express = require("express");
const app = express();
const connectMongoDb = require("./config/db");
const PORT = process.env.PORT || 5000;

connectMongoDb();
app.use(express.json({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", ["auth-token", "Content-Type"]);
  next();
});
app.get("/", (req, res) => res.send("Hello!"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.listen(PORT, () => console.log(`Node app listening on port ${PORT}!`));
