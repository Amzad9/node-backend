const mongoose = require("mongoose");
const Service = require("./../service/Product");
const CategoryService = require("./../service/Category");
const ConstantHelper = require("./../helpers/constant");
const CommonHelper = require("./../helpers/common");

const addFields = ['category', 'name', 'images', 'maximumPrice', 'sellingPrice', 'description', 'bestSeller', 'inStock', 'sizes', 'colors', 'discount', 'coupons', 'materials', 'brand', 'reviews'];
const updateFields = ['category', 'name', 'images', 'maximumPrice', 'sellingPrice', 'description', 'bestSeller', 'inStock', 'sizes', 'colors', 'discount', 'coupons', 'materials', 'brand', 'reviews', 'isActive', 'isDeleted', 'deletedAt', 'deletedBy'];

const project = "category name images maximumPrice sellingPrice description bestSeller inStock sizes colors discount coupons materials brand reviews isActive isDeleted createdAt";
const populate = [
  {
    path: "category",
    select: "name",
  },
  {
    path: "images",
    select: "imagekit",
  }
];

/*
  Product List
*/
exports.list = async (request, response) => {
  try {
    const filter = { isDeleted: false };

    const totalRecords = await Service.findAll(filter, '_id');

    if (request.query.searchText) filter["name"] = new RegExp(request.query.searchText, "i");
    if (request.query.category) filter["category"] = request.query.category;

    const limit = request.query.limit ? parseInt(request.query.limit, 10) : 10;
    const skip = request.query.page ? parseInt(request.query.page, 10) : 1;

    const option = {
      sort: { createdAt: -1 },
      limit: limit,
      skip: limit * (skip - 1),
    };

    const res = await Service.findAll(filter, project, option, populate);
    return response.status(200).json({
      message: "Product list",
      payload: res,
      totalRecords: totalRecords.length,
    });
  } catch (error) {
    console.log(error);
  }
};

/*
|   Add product
*/
exports.add = async (request, response) => {
  try {
    for (let key in request.body) {
      if (addFields.findIndex((v) => v === key) === -1) {
        return response
          .status(ConstantHelper.HttpCodeAndMessage["INVALID"].code)
          .json({ message: ConstantHelper.HttpCodeAndMessage["INVALID"].en });
      }
    }

    request.body["_id"] = new mongoose.Types.ObjectId();

    const result = await Service.add(request.body);
    const addedData = await Service.findOne({ _id: result._id }, project);

    CategoryService.updateOne({ _id: request.body.category }, { $addToSet: { products: result._id } })
    .then(res => console.log(res))
    .catch(err => console.log(err));

    return response.status(201).json({
      message: "Product created",
      payload: addedData,
    });
  } catch (error) {
    return response.status(500).json({ error, message: "Internal error." });
  }
};

/*
|   Product detail
*/
exports.detail = async (request, response) => {
  try {
    const filter = { _id: request.params._id }
    const result = await Service.findOne(filter, project, populate);

    return response.status(200).json({ message: 'Product detail.', payload: result });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." })
  }
};

/*
| Edit Product
*/
exports.edit = async (request, response) => {
  try {
    for (let key in request.body) {
      if (updateFields.findIndex(v => v === key) === -1) {
        return response
          .status(ConstantHelper.HttpCodeAndMessage['INVALID'].code)
          .json({ message: ConstantHelper.HttpCodeAndMessage['INVALID'].en });
      };
    }

    const filter = { _id: request.params._id };
    const exist = await Service.findOne(filter, '_id');
    if (!exist)
      return response
        .status(ConstantHelper.HttpCodeAndMessage['NOT_FOUND'].code)
        .json({ message: ConstantHelper.HttpCodeAndMessage['NOT_FOUND'].en });

    const result = await Service.updateOne(filter, request.body);

    const res = CommonHelper.formatResponse({ action: 'updateOne', result });
    return response.status(res.status).json({ message: res.message });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};

/*
| Custom
*/
exports.custom = async (request, response, next) => {
  try {
    if (request.tokens.user.type === 'manager' && request.tokens.user.branch._id !== request.body.branch)
      return response
        .status(ConstantHelper.HttpCodeAndMessage['FORBIDDEN'].code)
        .json({ message: ConstantHelper.HttpCodeAndMessage['FORBIDDEN'].en });

    const filter = {
      _id: request.query._id,
      "branches.branch": request.body.branch
    };

    const exist = await Service.findOne(filter, '_id');

    const updateFilter = { _id: request.query._id };
    let updateData = null;
    let options = null;

    if (exist) {
      if (request.body.hasOwnProperty('price'))
        updateData = {
          "$set": { "branches.$[elem].price": request.body.price }
        }

      if (request.body.hasOwnProperty('isActive')) {
        updateData = {
          "$set": { "branches.$[elem].isActive": request.body.isActive }
        }
      }

      options = {
        arrayFilters: [
          { "elem.branch": request.body.branch }
        ],
      };

    } else {
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
      updateData = {
        $addToSet: {
          branches: request.body,
        },
      };
    }

    const result = await Service.updateOne(updateFilter, updateData, options);
    const res = CommonHelper.formatResponse({ action: 'updateOne', result });
    return response.status(res.status).json({ message: res.message });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};

/*
| Update product modifier
*/
exports.updateModifier = async (request, response, next) => {
  try {
    const filter = {
      _id: request.query._id,
      "modifiers.modifier": request.body.modifier
    };

    const exist = await Service.findOne(filter, '_id');

    const updateFilter = { _id: request.query._id };
    let updateData = null;
    let options = null;

    if (exist) {
      if (request.body.hasOwnProperty('pivot')) {
        updateData = {
          "$set": {
            "modifiers.$[elem].pivot.minimum_options": request.body.pivot.minimum_options,
            "modifiers.$[elem].pivot.maximum_options": request.body.pivot.maximum_options
          }
        }
      } else if (request.body.hasOwnProperty('delete')) {
        updateData = {
          "$pull": {
            modifiers: { modifier: request.body.modifier }
          }
        }
      }

      options = {
        arrayFilters: [
          { "elem.modifier": request.body.modifier }
        ],
      };
    } else {
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
      updateData = {
        $addToSet: {
          modifiers: { modifier: request.body.modifier },
        },
      };
    }

    const result = await Service.updateOne(updateFilter, updateData, options);
    const res = CommonHelper.formatResponse({ action: 'updateOne', result });
    return response.status(res.status).json({ message: res.message });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};
