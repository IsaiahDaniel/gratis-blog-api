const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.yellow.bold);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      success: false,
      msg: "Cant connect to Database",
    });
  }
};

module.exports = connectDB;
