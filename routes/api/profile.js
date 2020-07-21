const router = require("express").Router();
const { verifyToken } = require("../../middleware/auth");
const {
  ProfileValidation,
  ExperienceValidation,
  EducationValidation,
} = require("../../validation");
const config = require("config");
const request = require("request");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

router.get("/me", verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

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
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    } else {
      // Create a profile
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.send(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

/**
 * @route GET api/profile/user/:user_id
 * @description Get profile by user_id
 * @access Public
 */
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile)
      return res.status(400).json({ message: "No Profile found !!!" });

    res.send(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId")
      return res.json({ message: "No Profile found !!!" });
    res.status(500).send(error.message);
  }
});

/**
 * @route DELETE api/profile/
 * @description Delete profile, user and posts
 * @access Private
 */
router.delete("/", verifyToken, async (req, res) => {
  try {
    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ message: "User deleted !" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

/**
 * @route PUT api/profile/experience
 * @description Add Profile Experience
 * @access Private
 */
router.put("/experience", verifyToken, async (req, res) => {
  const { error } = ExperienceValidation(req.body.experience);
  if (error) return res.status(400).json({ message: error.message });

  const { title, company, location, from, to, current, description } = req.body;
  const newExp = { title, company, location, from, to, current, description };
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);
    await profile.save();
    res.json({ profile });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

/**
 * @route DELETE api/profile/experience/:exp_id
 * @description Delete Experience from profile
 * @access Private
 */
router.delete("/experience/:exp_id", verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get remove index
    const indexToRemove = profile.experience.map((item) =>
      item.id.indexOf(req.params.exp_id)
    );
    profile.experience.splice(indexToRemove, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

/**  ***************** */
/**
 * @route DELETE api/profile/
 * @description Delete profile, user and posts
 * @access Private
 */
router.delete("/", verifyToken, async (req, res) => {
  try {
    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ message: "User deleted !" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

/**
 * @route PUT api/profile/education
 * @description Add Profile Experience
 * @access Private
 */
router.put("/education", verifyToken, async (req, res) => {
  const { error } = EducationValidation(req.body.education);
  if (error) return res.status(400).json({ message: error.message });

  const newEdu = ({
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body);

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education.unshift(newEdu);
    await profile.save();
    res.json({ profile });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

/**
 * @route DELETE api/profile/education/:edu_id
 * @description Delete Experience from profile
 * @access Private
 */
router.delete("/education/:edu_id", verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get remove index
    const indexToRemove = profile.experience.map((item) =>
      item.id.indexOf(req.params.edu_id)
    );
    profile.education.splice(indexToRemove, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

/**
 * @route GET api/profile/github/:usrename
 * @description Get Github Repos
 * @access Public
 */
router.get("/github/:username", async (req, res) => {
  try {
    let github_id = config.get("GithubClientId");
    let github_secret = config.get("GithubClientSecret");
    let username = req.params.username;
    let numberOfPages = 5;

    const options = {
      uri: `http://api.github.com/users/${username}/
            repos?per_page=${numberOfPages}&sort=created:asc&
            client_id=${github_id}&client_secret=${github_secret}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (err, response, body) => {
      if (err) console.log(err);
      if (response.statusCode != 200) {
        return res.status(404).json({ message: "No Github Profile" });
      }

      return res.json(JSON.parse(body));
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(Error);
  }
});
module.exports = router;
