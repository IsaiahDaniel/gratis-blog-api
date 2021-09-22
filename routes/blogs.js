const express = require("express");
const router = express.Router();

const blogsController = require("../controllers/blogsController");
const { body } = require("express-validator");
const auth = require("../middleware/auth");

router.get("/", blogsController.getBlogs);
router.get("/pagination", blogsController.getBlogsPagination);

router.post(
  "/create",
  [
    body("title", "Title Is required").not().isEmpty(),
    body("author", "Author Is required").not().isEmpty(),
    body("snippet", "snippet Is required").not().isEmpty(),
    body("body", "Body Is required").not().isEmpty(),
  ],
  blogsController.createBlog
);

router.put("/:id", blogsController.updateBlog);
router.get("/:id", blogsController.getBlog);
router.delete("/:id", blogsController.deleteBlog);

router.put(
  "/comments/:post_id",
  [auth, body("text", "Comment Title is required").not().isEmpty()],
  blogsController.createComment
);

router.get("/comment/:blog_id/:comment_id", auth, blogsController.getcomment);
router.get("/comment/:blog_id", auth, blogsController.getcomments);
router.put("/comment/:comment_id/:post_id", blogsController.updateComment);
router.delete("/comment/:comment_id/:post_id", blogsController.deleteComment);

module.exports = router;
