const mongoose = require("mongoose");

const Service = require("../service/Coupon");
const CommonHelper = require("../helpers/common");
const ConstantHelper = require("../helpers/constant");

const selectFields = 'name description couponCode startDate endDate discount type applicableAmount maximumApplyCount products isActive createdAt isDeleted';
const populate = [
  {
    path: 'products',
    select: 'name'
  }
];
const addFields = ['name', 'description', 'couponCode', 'startDate', 'endDate', 'discount', 'type', 'applicableAmount', 'maximumApplyCount', 'products'];
const updateFields = ['name', 'description', 'couponCode', 'startDate', 'endDate', 'discount', 'type', 'applicableAmount', 'maximumApplyCount', 'products', 'isActive', 'isDeleted', 'deletedAt'];

/*
  Coupon List
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
  Coupon Detail
*/
exports.detail = async (request, response, next) => {
  try {
    const filter = {_id: request.params._id, isDeleted: false}
    const result = await Service.findOne(filter);

    return response.status(200).json({ message: 'Coupon detail.', payload: result });
  } catch (error) {
    return response
        .status(500)
        .json({ error, message: "Internal error." })
  }
};

/*
  Add Coupon
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

    request.body['_id'] = new mongoose.Types.ObjectId;

    const result = await Service.add(request.body);
    return response.status(201).json({
      message: "Coupon created",
      payload: result,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};

/*
| Edit Coupon 
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
    return response.status(200).json({ message: 'Coupon updated', payload: result });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};


