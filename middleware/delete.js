
module.exports.deleteData = (req, res, next) => {
    req.body['isActive'] = false;
    req.body['isDeleted'] = true;
    req.body['deletedBy'] = req.tokens.user._id;
    req.body['deletedAt'] = Date.now();
  
    next();
  };
  
  
  module.exports.reinstateData = (req, res, next) => {
    req.body['isActive'] = true;
    req.body['isDeleted'] = false;
    req.body['deletedBy'] = null;
    req.body['deletedAt'] = null;
  
    next();
  };
  