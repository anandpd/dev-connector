const router = require("express").Router();
const { verifyToken } = require("../../middleware/auth");
const { ProfileValidation } = require("../../validation");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

router.get("/me", verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("User", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ message: "No Profile !!" });
    res.json({ profile });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error !");
  }
});

router.post("/", verifyToken, async (req, res) => {
  const {
    company,
    status,
    skills,
    website,
    location,
    bio,
    githubusername,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;
  let { error } = ProfileValidation({ skills, status });
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Profile Object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  // skills are *required
  profileFields.skills = skills.split(",").map((skill) => skill.trim());
  console.log(profileFields.skills);

  // Social Object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (facebook) profileFields.social.facebook = facebook;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;
  if (linkedin) profileFields.social.linkedin = linkedin;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    // update
    if (profile) {
      profile = Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    } else {
      // Create a profile
      profile = new Profile(profileFields);
      await profile.save();
      return res.json({ profile });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

module.exports = router;
