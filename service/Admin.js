const Model = require("../models/admin");

/**
 * 
 * Return Admin user list
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
 * Add admin user
 * @param {*} filter
 * @param {*} add data
 * @returns
 */
 module.exports.add = async (data) => {
  try {
    const admin = new Model(data);
    return await admin.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Find admin
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
 * Update admin user
 * @param {*} query
 * @param {*} update data
 * @returns
 */
 module.exports.updateOne = async (query, data) => {
  try {
    return await Model.updateOne(query, data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};