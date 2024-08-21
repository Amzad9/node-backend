const mongoose = require("mongoose");

const Service = require("./../service/Category");
const CommonHelper = require("./../helpers/common");
const ConstantHelper = require("./../helpers/constant");

const selectFields = 'name description image isActive createdAt isDeleted';
const populate = [
  {
    path: 'products',
    select: 'name'
  }
];
const addFields = ['name', 'description'];
const updateFields = ['name', 'description', 'image', 'isActive', 'isDeleted', 'deletedAt'];

/*
  Category List
*/
exports.list = async (request, response) => {
  try {
    let {limit, page, searchText} = request.query;

    limit = limit ? parseInt(limit, 10) : 10;
    const skip = limit * (parseInt(page || 1, 10) - 1);

    const option = {
      sort: {
        createdAt: -1,
      },
      limit,
      skip,
    };

    const filter = {
      isDeleted: false
    };
    const totalRecords = await Service.findAll(filter);

    if (searchText) filter["name"] = new RegExp(searchText, "i");

    const result = await Service.findAll(filter, selectFields, option, populate);
    return response.status(200).json({
      message: "success",
      payload: result,
      totalRecords: searchText ? result.length : totalRecords.length });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};

/*
  Category Detail
*/
exports.detail = async (request, response, next) => {
  try {
    const filter = {_id: request.params._id, isDeleted: false}
    const result = await Service.findOne(filter);

    return response.status(200).json({ message: 'Category detail.', payload: result });
  } catch (error) {
    return response
        .status(500)
        .json({ error, message: "Internal error." })
  }
};

/*
  Add Category
*/
exports.add = async (request, response, next) => {
  try {
    console.log(request.body);
    for (let key in request.body) {
      if (addFields.findIndex(v => v === key) === -1) {
        return response
          .status(ConstantHelper.HttpCodeAndMessage['INVALID'].code)
          .json({ message: ConstantHelper.HttpCodeAndMessage['INVALID'].en });
      };
    }

    request.body['_id'] = new mongoose.Types.ObjectId;

    const result = await Service.add(request.body);
    return response.status(201).json({
      message: "Category created",
      payload: result,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};

/*
| Edit category 
*/
exports.edit = async (request, response, next) => {
  try {
    for (let key in request.body) {
      if (updateFields.findIndex(v => v === key) === -1) {
        return response
          .status(ConstantHelper.HttpCodeAndMessage['INVALID'].code)
          .json({ message: ConstantHelper.HttpCodeAndMessage['INVALID'].en });
      };
    }

    const filter = { _id: request.params._id };
    const exist = await Service.findOne(filter);
    if (!exist)
      return response
        .status(ConstantHelper.HttpCodeAndMessage['NOT_FOUND'].code)
        .json({ message: ConstantHelper.HttpCodeAndMessage['NOT_FOUND'].en });

    const result = await Service.updateOne(filter, request.body, {new: true});
    return response.status(200).json({ message: 'Category updated', payload: result });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};

/*
  Reorder Category
*/
exports.reorder = async (request, response, next) => {
  try {
    for (const cat of request.body.data) {
      const filter = { _id: cat._id };
      const Category = {
        order: cat.order,
        updatedBy: request.tokens.user._id
      };

      await Service.updateOne(filter, Category, {new: true});
    }

    return response.status(200).json({ message: 'Re-ordered successfully.' });
  } catch (error) {
    return response
      .status(500)
      .json({ error: error, message: "Error in re-ordering" });
  }
};


