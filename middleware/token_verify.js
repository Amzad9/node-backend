const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ message: "Authentication failed." });
    
  const token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.tokens = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentication failed.",
    });
  }
};
