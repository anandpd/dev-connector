const router = require("express").Router(),
  User = require("../../models/User"),
  Post = require("../../models/Post"),
  { verifyToken } = require("../../middleware/auth"),
  { PostValidation } = require("../../validation");

/**
 * @route - POST api/posts
 * @description - Create a Post
 * @access - Private
 */

router.post("/", verifyToken, async (req, res) => {
  const { error } = PostValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const user = await User.findById(req.user.id);
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });

    const post = await newPost.save();
    console.log("Post Created !");
    res.json({ post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

/**
 * @route - GET api/posts
 * @description - Get all Posts
 * @access - Private
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

/**
 * @route - GET api/posts/:id
 * @description - Get a post by id
 * @access - Private
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const postById = await Post.findById(req.params.id);
    if (!postById)
      return res.status(400).send({ message: "Post not found !!" });
    res.json({ postById });
  } catch (error) {
    console.log(error);
    if (error.kind == "ObjectId")
      return res.status(400).send({ message: "Post not found !!" });
    return res.status(500).json({ message: error });
  }
});

/**
 * @route - DELETE api/posts/:id
 * @description - Delete a post by id
 * @access - Private
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postById = await Post.findById(req.params.id);
    if (!postById)
      return res.status(401).json({ message: "Post does not Exists !" });

    // Check on user
    if (postById.user.toString() != req.user.id)
      // post.user.id is Int and req.user.id is String
      return res.status(401).json({ message: "User not Authorized" });
    await postById.remove();
    res.json({ message: "Post removed !" });
  } catch (error) {
    console.log(error);
    if (error.kind == "ObjectId")
      return res.status(400).send({ message: "Post not found !!" });
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
