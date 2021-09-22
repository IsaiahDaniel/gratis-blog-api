const express = require("express");
const app = express();

const color = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "./config/config.env" });

const connectDB = require("./config/db");
const auth = require("./middleware/auth");

// Load Middleware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connect To Database
connectDB();

// Load Routes
app.get("/", (req, res) => res.send("Hello world"));
app.use("/api/v1/blogs", require("./routes/blogs"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server is Listening on port ${PORT} in ${process.env.NODE_ENV} mode`.cyan
      .underline.bold
  )
);
