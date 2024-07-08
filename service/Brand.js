const Model = require("../models/brand");

/**
 * Return brand list
 * @param {*} user
 * @param {*} query
 * @returns
 */
module.exports.findAll = async (query = {}, project = '_id', option = {}, populate = []) => {
  try {
    return await Model.find(query, project, option).populate(populate);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Find brand
 * @param {*} user
 * @param {*} query
 * @returns
 */
module.exports.findOne = async (query, project = {}, populate = []) => {
  try {
    return Model.findOne(query).select(project).populate(populate);;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Add brand
 * @param {*} filter
 * @param {*} add data
 * @returns
 */
 module.exports.add = async (data) => {
  try {
    const instance = new Model(data);
    return await instance.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Update brand
 * @param {*} query
 * @param {*} update data
 * @returns
 */
 module.exports.updateOne = async (query, data, options = {new: true, upsert: false}) => {
  try {
    return await Model.findOneAndUpdate(query, data, options);
  } catch (error) {
    console.log(error);
    throw error;
  }
};