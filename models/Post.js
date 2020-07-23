const mongoose = require("mongoose");

let requiredString = { type: String, required: true };

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  text: requiredString,
  name: String,
  avatar: String,
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      text: requiredString,
      name: String,
      avatar: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("Post", PostSchema);
