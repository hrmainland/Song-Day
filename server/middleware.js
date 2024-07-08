module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "User not logged in" });
  }
  next();
};
