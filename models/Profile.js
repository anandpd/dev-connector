const mongoose = require("mongoose");

let requiredString = { type: String, required: true };

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  company: String,
  website: String,
  location: String,
  bio: String,
  githubusername: String,
  status: requiredString,
  skills: [requiredString],
  experience: [
    {
      title: requiredString,
      company: requiredString,
      location: String,
      from: {
        type: Date,
        required: true,
      },
      to: Date,
      current: {
        type: Boolean,
        default: false,
      },
      description: String,
    },
  ],

  education: [
    {
      school: requiredString,
      degree: requiredString,
      fieldofstudy: requiredString,
      from: {
        type: Date,
        required: true,
      },
      to: Date,
      current: {
        type: Boolean,
        default: false,
      },
      description: String,
    },
  ],

  social: {
    youtube: String,
    twitter: String,
    facebook: String,
    linkedin: String,
    instagram: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("Profile", ProfileSchema);
