const router = require("express").Router(),
  User = require("../../models/User"),
  Post = require("../../models/Post"),
  { verifyToken } = require("../../middleware/auth"),
  { PostValidation, CommentValidation } = require("../../validation");

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

/**
 * @route - PUT api/posts/like/:id
 * @description - Like a post by id
 * @access - Private
 */

router.put("/likes/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post is already been liked by a user//
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    )
      return res.status(400).json({ message: "Post already liked" });
    post.likes.unshift({ user: req.user.id });
    await post.save();
    return res.status(200).send(post.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error !");
  }
});

/**
 * @route - PUT api/posts/unlike/:id
 * @description - Like a post by id
 * @access - Private
 */

router.put("/unlike/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post is already been liked by a user//
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Post has not yet been liked !!" });
    }

    // Get the remove index
    let removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();
    return res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something went wrong !");
  }
});

/**
 * @route - POST api/posts/comment/:id
 * @description - Create a Comment on a Post
 * @access - Private
 */

router.post("/comment/:id", verifyToken, async (req, res) => {
  const { error } = CommentValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.id);
    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };
    post.comments.unshift(newComment);
    await post.save();
    console.log("Comment Posted :)");
    res.json(post.comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
});

/**
 * @route - DELETE api/posts/comment/:postid/:commentid
 * @description - Delete a comment
 * @access - Private
 */

router.delete("/comment/:id/:comment_id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment)
      return res.status(404).json({ message: "Comment does not exist !" });
    if (comment.user.toString() !== req.user.id)
      res.status(401).json({ message: "User not Authorized" });

    //
    let removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();
    return res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something went wrong !");
  }
});
module.exports = router;
