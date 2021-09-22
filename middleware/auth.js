const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "No token cant authenticate",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtToken);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      success: false,
      msg: "Invalid Token",
    });
  }
};
