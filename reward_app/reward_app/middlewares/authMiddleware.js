const jwt = require('jsonwebtoken');

// Authentication middleware
const authMiddleware = (req, res, next) => {
  // Extract token from the request headers
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
      return res.status(401).json({ message: 'No token provided', success: 'false' });
    }
  const token = authHeader.split(' ')[1]; // Extract the token part
  console.log('Extracted token:', token);

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    // Verify token
    console.log("env" ,process.env.JWT_SECRET)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user to request object
    next(); // Call the next middleware
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
