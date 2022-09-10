const mongoose = require("mongoose");
const Service = require("./../service/Product");
const CategoryService = require("./../service/Category");
const ConstantHelper = require("./../helpers/Constant");
const CommonHelper = require("./../helpers/Common");


const addFields = ['name', 'nameLocalized', 'category', 'price', 'calories', 'sku'];
const updateFields = ['name', 'nameLocalized', 'description', 'descriptionLocalized', 'preparationTime', 'oldCategory', 'category', 'price', 'calories', 'sku', 'image', 'coverImage', 'isActive', 'bestSeller', 'isDeleted', 'deletedAt', 'deletedBy'];

const project = "category branches modifiers sku name nameLocalized description descriptionLocalized image coverImage price calories preparationTime sellingMethod isActive isDeleted bestSeller createdAt";
const populate = [
  {
    path: "category",
    select: "name nameLocalized",
  },
  {
    path: "branches",
    populate: [
      {
        path: "branch",
        select: 'name nameLocalized reference'
      }
    ],
  },
  {
    path: "modifiers.modifier",
    select: "name nameLocalized  options isDeleted isActive",
    match: { isActive: true, isDeleted: false },
    populate: [
      {
        path: "options",
        select: "name nameLocalized  sku price calories costingMethod",
      }
    ]
  },
  {
    path: "imageKit",
    select: "imagekit",
  },
  {
    path: "coverImageKit",
    select: "imagekit",
  }
];

/*
  Item List
*/
exports.list = async (request, response, next) => {
  try {
    const user = request.tokens.user;
    const filter = { restaurant: user.settings._id, isDeleted: false };

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
      message: "Item list",
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
exports.add = async (request, response, next) => {
  try {
    if (
      !(
        request.tokens.user.type === "owner" ||
        request.tokens.user.type === "manager"
      )
    )
      return response
        .status(ConstantHelper.HttpCodeAndMessage["FORBIDDEN"].code)
        .json({ message: ConstantHelper.HttpCodeAndMessage["FORBIDDEN"].en });

    for (let key in request.body) {
      if (addFields.findIndex((v) => v === key) === -1) {
        return response
          .status(ConstantHelper.HttpCodeAndMessage["INVALID"].code)
          .json({ message: ConstantHelper.HttpCodeAndMessage["INVALID"].en });
      }
    }

    const totalBranch = await Service.findAll({});

    request.body["_id"] = new mongoose.Types.ObjectId();
    request.body["restaurant"] = request.tokens.user.settings._id;
    request.body["createdBy"] = request.tokens.user._id;
    if (!request.body["sku"]) request.body["sku"] = "sk-" + CommonHelper.pad(totalBranch.length + 1, 4);

    const result = await Service.add(request.body);
    const addedData = await Service.findOne({ _id: result._id }, project, populate);

    CategoryService.updateOne({ _id: request.body.category }, { $addToSet: { products: result._id } }).then(result => console.log('Category updated'));

    return response.status(201).json({
      message: "Product created",
      payload: addedData,
    });
  } catch (error) {
    return response.status(500).json({ error, message: "Internal error." });
  }
};

/*
|   Item detail
*/
exports.detail = async (request, response, next) => {
  try {
    const filter = { _id: request.query._id }
    const result = await Service.findOne(filter, project, populate);

    if (result && request.tokens.user.type === 'manager') {
      const ownBranches = result.branches.filter(b => b.branch._id.toString() === request.tokens.user.branch._id);
      result.branches = ownBranches;
    }

    return response.status(200).json({ message: 'Menu detail.', payload: result });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." })
  }
};

/*
| Edit Menu
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
    const exist = await Service.findOne(filter, '_id');
    if (!exist)
      return response
        .status(ConstantHelper.HttpCodeAndMessage['NOT_FOUND'].code)
        .json({ message: ConstantHelper.HttpCodeAndMessage['NOT_FOUND'].en });

    request.body['updatedBy'] = request.tokens.user._id;

    const result = await Service.updateOne(filter, request.body);

    if (request.body.hasOwnProperty('category')) {
      if (request.body.category !== request.body.oldCategory) {
        CategoryService.updateOne({ _id: request.body.category }, { $addToSet: { products: request.query._id } }).then(result => console.log('Category updated'));

        CategoryService.updateOne({ _id: request.body.oldCategory }, { $pull: { products: request.query._id } }).then(result => console.log('Category removed'));
      }
    }

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
