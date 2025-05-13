const setCsrfCookie = (req, res, next) => {
  res.set('X-CSRF-Protection', '1');
  
  next();
};

module.exports = {
  setCsrfCookie
};