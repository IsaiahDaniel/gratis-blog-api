const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const colors = require("colors");
const Blog = require("./models/Blog");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGOURI);

const blogs = JSON.parse(fs.readFileSync(`${__dirname}/_data/blogs.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`));

const importData = async () => {
  try {
    await Blog.create(blogs);

    console.log("Data Imported".inverse.green);

    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

const deleteData = async () => {
  try {
    await Blog.deleteMany();

    console.log("Data Removed".inverse.red);

    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
