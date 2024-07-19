// server/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }


  jwt.verify(token, 'saikrishna', (err, user) => {
    console.log(token)
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
