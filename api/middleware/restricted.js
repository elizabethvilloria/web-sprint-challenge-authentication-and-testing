const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets/secrets'); 

function restricted(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Token invalid" });
    }
    req.user = decodedToken;  
    next();
  });
}

module.exports = restricted;

