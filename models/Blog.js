const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    snippet: {
      type: String,
      required: true,
    },
    slug: String,
    body: {
      type: String,
      required: true,
    },
    comment: [
      {
        user: mongoose.Schema.Types.ObjectId,
        text: String,
        name: String,
      },
    ],
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });

  next();
});

module.exports = mongoose.model("blog", blogSchema);
