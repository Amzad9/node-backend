module.exports = (req, res, next) => {
    try {
      if (!req.headers.apikey)
        return res.status(400).json({ message: "No API Key found." });
  
      const apikey = req.headers.apikey.replace(/['"]+/g, "");
  
      if (apikey !== process.env.API_KEY)
        return res.status(401).json({message: "Authentication failed."});
  
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Authentication failed.",
      });
    }
};
  