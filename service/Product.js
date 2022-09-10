const Model = require("./../models/product");

/**
 * Return list
 * @param {*} query
 * @returns
 */
 module.exports.findAll = async (query, project, option = {}, populate = []) => {
  try {
    return await Model.find(query, project, option).populate(populate);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Find one
 * @param {*} query
 * @returns
 */
 module.exports.findOne = async (query, project = {}, populate = []) => {
  try {
    return Model.findOne(query).select(project).populate(populate);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Add
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
 * Update
 * @param {*} query
 * @param {*} update data
 * @returns
 */
 module.exports.updateOne = async (query, data, options = {}) => {
  try {
    return await Model.updateOne(query, data, options);
  } catch (error) {
    console.log(error);
    throw error;
  }
};