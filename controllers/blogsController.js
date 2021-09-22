const Blog = require("../models/Blog");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const router = require("../routes/blogs");

// @route   GET /api/v1/blogs
// @desc    Fetch All blogs
// @access  Public
module.exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
};

// @route   GET /api/v1/blogs
// @desc    Fetch All blogs
// @access  Public
module.exports.getBlogsPagination = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const blogs = await Blog.find().sort({ createdAt: -1 });

    const paginatedBlogs = blogs.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedBlogs,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
};

// @route   GET /api/v1/blogs
// @desc    Fetch Single blog
// @access  Public
module.exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog)
      return res
        .status(400)
        .json({ success: false, msg: `No Blog with the Id ${req.params.id}` });

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, msg: `No Blog with the id ${req.params.id}` });
    }
    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
};

// @route   GET /api/v1/blogs
// @desc    Create Blog
// @access  Public
module.exports.createBlog = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ success: false, msg: errors.array() });

  try {
    const blog = await Blog.create(req.body);

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: true,
      msg: "Server Error",
    });
  }
};

// @route   PUT /api/v1/blogs
// @desc    Update Blog
// @access  Private

module.exports.updateBlog = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ success: false, msg: errors.array() });

  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: false,
      data: blog,
    });
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, msg: `No Blog wth the id ${req.params.id}` });
    }
    res.status(500).json({
      success: true,
      msg: "Server Error",
    });
  }
};

// @route   DELETE /api/v1/blogs
// @desc    Delete Blog
// @access  Private
module.exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndRemove(req.params.id);

    if (!blog)
      return res
        .status(400)
        .json({ success: false, msg: `No Blog with the id ${req.params.id}` });

    res.status(200).json({ success: true, msg: "Blog deleted", data: blog });
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, msg: `No Blog with the id ${req.params.id}` });
    }
    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
};

// @route   PUT /api/blogs/comment/
// @desc    Create comment on Blog
// @access  Private

module.exports.createComment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ success: false, msg: errors.array() });

  try {
    const user = await User.findById(req.user.id);
    const blog = await Blog.findById(req.params.post_id);

    const newComment = {
      text: req.body.text,
      user: req.user.id,
      name: user.name,
    };

    blog.comment.unshift(newComment);

    await blog.save();

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      msg: "server Error",
    });
  }
};

// @route   GET /api/v1/comment/:blog_id/:comment_id
// @desc    Get single comment on a blog post
// @access  private

module.exports.getcomment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blog_id);

    if (!blog) {
      return res.status(400).json({
        success: false,
        msg: `cant find a blog with the id ${req.params.blog_id}`,
      });
    }

    const singleComment = blog.comment.filter(
      (comment) => comment.id === req.params.comment_id
    );

    res.status(200).json({ success: true, data: singleComment });
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        msg: `cant find a blog with the id ${req.params.blog_id}`,
      });
    }
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// @route   GET /api/v1/comment/:blog_id
// @desc    Get All comments on a blog post
// @access  private

module.exports.getcomments = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blog_id);

    if (!blog) {
      return res.status(400).json({
        success: false,
        msg: `cant find a blog with the id ${req.params.blog_id}`,
      });
    }

    const singleComment = blog.comment;

    res.status(200).json({ success: true, data: singleComment });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// @route   GET /api/v1/comment/:blog_id
// @desc    Get All comments on a blog post
// @access  private

module.exports.updateComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.post_id);

    // const commentIndex = blog.comment
    //   .map((comment) => comment.id)
    //   .indexOf(req.params.comment_id);

    // blog.comment.splice(removeIndex, 1);

    const singleComment = blog.comment.filter(
      (comment) => comment.id === req.params.comment_id
    );

    const singleCommentId = singleComment[0].id;

    const updatedComment = Blog.findByIdAndUpdate(
      singleCommentId
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({ success: true, data: updatedComment });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};

// @route   Delete /api/v1/comment/:blog_id
// @desc    Delete Comment on a Post
// @access  private

module.exports.deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.post_id);

    const removeIndex = blog.comment
      .map((comment) => comment.id)
      .indexOf(req.params.comment_id);

    blog.comment.splice(removeIndex, 1);

    blog.save();

    res
      .status(200)
      .json({ success: true, msg: "Comment Removed", data: blog.comment });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};
