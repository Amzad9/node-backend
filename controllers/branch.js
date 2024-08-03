const mongoose = require("mongoose");
const Service = require("./../service/Branch");
const CommonHelper = require("./../helpers/common");
const ConstantHelper = require("./../helpers/constant");

const project =
  "name landmark address location locality city state country pincode contact contactName deliveryCharge hoursConfiguration deliveryStatus pickupStatus image imageKit minCartAmount maxCashAccepted isActive createdAt";
const addFields = ['name', 'address', 'landmark', 'location', 'locality', 'city', 'state', 'country', 'pincode', 'deliveryCharge', 'hoursConfiguration', 'deliveryStatus', 'pickupStatus', 'minCartAmount', 'maxCashAccepted', 'contact', 'contactName', 'dialCode'];
const updateFields = ['name', 'address', 'landmark', 'location', 'locality', 'city', 'state', 'country', 'pincode', 'deliveryCharge', 'hoursConfiguration', 'deliveryStatus', 'pickupStatus', 'minCartAmount', 'maxCashAccepted', 'contact', 'contactName', 'dialCode', 'isActive', 'isDeleted', 'deletedAt'];

/**
 * List Branch
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
exports.list = async (request, response) => {
  try {
    console.log('Branch');
    const filter = {};
    // switch (request.tokens.user.type) {
    //   case 'support':
    //     if (request.query.restaurant) filter['restaurant'] = request.query.restaurant;
    //     break;

    //   case 'owner':
    //     filter['restaurant'] = request.tokens.user.settings._id;
    //     break;

    //   case 'manager':
    //     filter['_id'] = request.tokens.user.branch._id;
    //     break;
    // }


    const totalRecords = await Service.findAll(filter);

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
    if (searchText) filter["name"] = new RegExp(searchText, "i");

    const populate = [];
    // const populateFields = ['restaurant'];

    // if (request.query.hasOwnProperty('include') && request.query.include) {
    //   const includeKeys = request.query.include.split(',');

    //   includeKeys.forEach(key => {
    //     const index = populateFields.findIndex(field => field === key);
    //     if (index !== -1) populate.push(key);
    //   });
    // }

    const result = await Service.findAll(filter, project, option, populate);
    return response
      .status(200)
      .json({
        message: "success",
        payload: result,
        totalRecords: searchText ? result.length : totalRecords.length,
      });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Error in finding list" });
  }
};

/**
 * Add Branch
 * @param {*} response
 * @param {*} next
 */
exports.add = async (request, response, next) => {
  try {
    for (let key in request.body) {
      if (addFields.findIndex((v) => v === key) === -1) {
        return response
          .status(ConstantHelper.HttpCodeAndMessage["INVALID"].code)
          .json({ message: ConstantHelper.HttpCodeAndMessage["INVALID"].en });
      }
    }

    // const filter = {};
    // if (request.tokens.user.type === 'support')
    //   filter['restaurant'] = request.body.restaurant;
    // else
    //   filter['restaurant'] = request.tokens.user.settings._id;

    // const totalBranch = await Service.findAll(filter);

    request.body["_id"] = new mongoose.Types.ObjectId();
    // request.body["restaurant"] = filter['restaurant'];
    // request.body["createdBy"] = request.tokens.user._id;
    // request.body["reference"] = "B" + CommonHelper.pad(totalBranch.length + 1, 2);

    const result = await Service.add(request.body);
    return response.status(201).json({
      message: "Branch created",
      payload: result,
    });
  } catch (error) {
    return response.status(500).json({ error, message: "Internal error." });
  }
};

/**
 * Branch detail by ID
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
exports.detail = async (request, response, next) => {
  try {
    const filter = { _id: request.query._id };
    const populate = [
      {
        path: 'imageKit',
        select: 'imagekit'
      }
    ]
    const branch = await Service.findOne(filter, project, populate);

    const res = CommonHelper.formatResponse({
      action: "findOne",
      result: branch,
    });
    return response
      .status(res.status)
      .json({ message: res.message, payload: branch });
  } catch (error) {
    return response.status(500).json({ error, message: "Internal error." });
  }
};

/**
 * Update branch
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
exports.update = async (request, response, next) => {
  try {
    for (let key in request.body) {
      if (updateFields.findIndex((v) => v === key) === -1) {
        return response
          .status(400)
          .json({ message: "Bad request." });
      }
    }

    const filter = { _id: request.query._id };
    const exist = await Service.findOne(filter, '_id');
    if (!exist)
      return response
        .status(404)
        .json({ message: "Resource not found." });

    request.body['updatedBy'] = request.tokens.user._id;

    const result = await Service.updateOne(
      filter,
      request.body,
      { new: true }
    );

    return response.status(200).json({ message: 'Branch updated.', payload: result });
  } catch (error) {
    return response.status(500).json({ error, message: "Internal error." });
  }
};