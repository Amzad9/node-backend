const Model = require("../models/restaurant_setting");
const AddFields = ["restaurantName"];

module.exports.addFields = AddFields;

module.exports.findAll = async (query = {}, project = '_id', option = {}, populate = []) => {
  try {
    return await Model.find(query, project, option).populate(populate);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.findOne = async (query, select = '_id', populate = []) => {
  try {
    return await Model.findOne(query).select(select).populate(populate);
  } catch (error) {
    throw error;
  }
};

module.exports.add = async (data) => {
  try {
    const inst = new Model(data);
    return await inst.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.exist = async (query) => {
  try {
    return Model.findOne(query).select("_id");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.updateOne = async (query, data, options = { new: true }) => {
  try {
    return await Model.findOneAndUpdate(query, data, options);
  } catch (error) {
    console.log(error);
    throw error;
  }
};




