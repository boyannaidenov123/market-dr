const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    User.findOne({
      email: decodedToken.email,
      _id: decodedToken.userId,
    }).then((user) => {
      if (!user) {
        res.status(401).json({
          message: "You are not admin!",
        });
      }
      if (user.admin) {
        next();
      } else {
        throw new Error("User is not admin");
      }
    });
  } catch (error) {
    res.status(401).json({
      message: "You are not admin!",
    });
  }
};
