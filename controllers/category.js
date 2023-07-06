const mongoose = require("mongoose");

const Service = require("./../service/Category");
const CommonHelper = require("./../helpers/common");
const ConstantHelper = require("./../helpers/constant");

const selectFields = 'name nameLocalized description descriptionLocalized source order isActive createdAt isDeleted';
const populate = [
  {
    path: 'products',
    select: 'name nameLocalized'
  }
];
const addFields = ['name', 'nameLocalized', 'description', 'descriptionLocalized'];
const updateFields = ['name', 'nameLocalized', 'description', 'descriptionLocalized', 'order', 'reference', 'isActive', 'isDeleted'];

/*
  Category List
*/
exports.list = async (request, response, next) => {
  try {
    const limit = parseInt(request.query.limit, 10);
    const skip = limit * (parseInt(request.query.page, 10) - 1);

    const option = {
      sort: {
        order: 1,
      },
      limit: limit,
      skip: skip,
    };

    const filter = {
      restaurant: request.tokens.user.settings._id,
      isDeleted: false
    };
    const totalRecords = await Service.findAll(filter);

    if (request.query.searchText)
      filter["name"] = new RegExp(request.query.searchText, "i");

    const result = await Service.findAll(filter, selectFields, option, populate);
    return response.status(200).json({ message: "success", payload: result, totalRecords: totalRecords.length });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};

/*
  Category List
*/
exports.detail = async (request, response, next) => {
  try {
    const filter = {_id: request.query._id}
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
    for (let key in request.body) {
      if (addFields.findIndex(v => v === key) === -1) {
        return response
          .status(ConstantHelper.HttpCodeAndMessage['INVALID'].code)
          .json({ message: ConstantHelper.HttpCodeAndMessage['INVALID'].en });
      };
    }

    const filter = {restaurant: request.tokens.user.settings._id}
    const totalCategory = await Service.findAll(filter, '_id');

    request.body['_id'] = new mongoose.Types.ObjectId;
    request.body['restaurant'] = request.tokens.user.settings._id;
    request.body['order'] = totalCategory.length + 1;
    request.body['createdBy'] = request.tokens.user._id;
    request.body["reference"] = "C" + CommonHelper.pad(totalCategory.length + 1, 2);

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

    const filter = { _id: request.query._id };
    const exist = await Service.findOne(filter);
    if (!exist)
      return response
        .status(ConstantHelper.HttpCodeAndMessage['NOT_FOUND'].code)
        .json({ message: ConstantHelper.HttpCodeAndMessage['NOT_FOUND'].en });

    request.body['updatedBy'] = request.tokens.user._id;

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


