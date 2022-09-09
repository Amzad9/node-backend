const jwt = require("jsonwebtoken");

const RestaurantHelper = require('./../helpers/restaurant')

module.exports = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ message: "Authentication failed." });
    
  const token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    decoded.user.isOtherRestaurant = RestaurantHelper.isOtherRestaurant(decoded.user);
    req.tokens = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentication failed.",
    });
  }
};
