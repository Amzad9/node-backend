const mongoose = require("mongoose");

const AdminModel = require("../models/admin");

const md5 = require("md5");
var jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const AdminService = require("../service/Admin");
const ConstantHelper = require("./../helpers/Constant");
const CommonHelper = require("./../helpers/Common");

const selectFields =
  "restaurantId branch name email contact dialCode type settings isActive createdAt isDeleted";
const addFields = [
  "branch",
  "name",
  "email",
  "contact",
  "dialCode",
  "type",
  "password",
];
const updateFields = [
  "branch",
  "name",
  "email",
  "contact",
  "dialCode",
  "password",
  "isActive",
  "isDeleted",
  "deletedAt",
  "deletedBy",
];

/*
|  Get Basicinfo
*/
exports.getBasicinfo = (request, response, next) => {
  const adminDetails = request.tokens.user;
  const filter = { _id: adminDetails._id };
  console.log(filter);
  AdminModel.findOne(filter)
    .populate({
      path: "branch",
      select: "branchId name",
    })
    .populate({
      path: "settings",
      populate: [
        {
          path: "logo",
        },
        {
          path: "cover",
        },
        {
          path: "coverImages",
        },
        {
          path: "integration",
          select: "name slug additionalData isActive isDeleted",
        },
      ],
    })
    .select(
      "restaurantId name email contact dialCode type status createdAt branch settings"
    )
    .exec()
    .then((user) => {
      if (!user)
        return response.status(401).json({ message: "User not found." });

      return response.status(200).json({
        message: "User Detail",
        payload: user,
      });
    })
    .catch((error) =>
      response.status(500).json({ error, message: "Error in finding detail." })
    );
};

/*
|  Admin login
*/
exports.login = (request, response, next) => {
  const password = md5(request.body.password);
  const filter = {
    contact: request.body.contact,
    password,
  };

  AdminModel.findOne(filter)
    .populate({
      path: "settings",
      select: "restaurantId restaurantName status integration tag",
      populate: {
        path: "integration",
        select: "name slug additionalData isActive isDeleted",
      },
    })
    .select(
      "restaurantId name email contact type branch isActive status settings"
    )
    .then((user) => {
      console.log(user);
      if (!user)
        return response.status(401).json({ message: "Authentication failed." });
      else if (user.type === "owner" || user.type === "manager" || user.type === "driver") {
        if (user.settings.status === "Inactive")
          return response.status(409).json({
            message:
              "Your login has been restricted please contact your account administrator.",
          });
      }
      const userData = user.toObject(); // Can't modify mongoose doc, hence converting to plain object
      if (!userData.settings) userData.settings = { rejectionNotes: [] }; // Required for showing rejection notes

      const token = jwt.sign(
        {
          user: userData,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      return response.status(200).json({
        message: "Authentication successful.",
        token: token,
        user: userData,
      });
    })
    .catch((error) =>
      response.status(500).json({ error, message: "Internal Error." })
    );
};

/*
|  Admin list
*/
exports.list = async (request, response, next) => {
  try {
    const filter = {};
    switch (request.tokens.user.type || 'owner') {
      case "support":
        if (request.query.restaurant)
          filter["settings"] = request.query.restaurant;
        break;

      case "owner":
        filter["settings"] = request.tokens.user.settings._id;
        break;

      case "manager":
        filter["_id"] = request.tokens.user.branch._id;
        break;
    }
    if (request.query.type) filter["type"] = request.query.type;

    const totalRecords = await AdminService.findAll(filter);

    const populate = [
      {
        path: "branch",
        select: "name nameLocalized reference",
      },
    ];

    const limit = parseInt(request.query.limit ? request.query.limit : 10, 10);
    const skip = limit * (parseInt(request.query.page ? request.query.page : 1, 10) - 1);

    const option = {
      sort: {
        createdAt: -1,
      },
      limit: limit,
      skip: skip,
    };

    const result = await AdminService.findAll(
      filter,
      selectFields,
      option,
      populate
    );
    return response
      .status(200)
      .json({
        message: "success",
        payload: result,
        totalRecords: totalRecords.length,
      });
  } catch (error) {
    return response.status(500).json({ error, message: "Internal error." });
  }
};

/*
| Add admin user 
*/
exports.addUser = async (request, response, next) => {
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

    const exist = await AdminService.findOne(
      { contact: request.body.contact },
      "_id"
    );
    if (exist)
      return response
        .status(ConstantHelper.HttpCodeAndMessage["EXIST"].code)
        .json({ message: "Contact number already exists." });

    request.body["_id"] = new mongoose.Types.ObjectId();
    request.body["restaurantId"] = request.tokens.user.settings.restaurantId;
    request.body["auth"] = Math.random().toString(36).slice(2);
    request.body["password"] = md5(request.body.password);
    request.body["settings"] = request.tokens.user.settings._id;
    request.body["createdBy"] = request.tokens.user._id;

    const result = await AdminService.add(request.body);
    return response.status(201).json({
      message: "User created",
      payload: result,
    });
  } catch (error) {
    return response.status(500).json({ error, message: "Internal error." });
  }
};

/*
|   Admin detail
*/
exports.userDetail = async (request, response, next) => {
  try {
    const filter = { _id: request.query._id };
    const populate = [
      {
        path: "branch",
        select: "name nameLocalized reference",
      },
    ];
    const user = await AdminService.findOne(filter, selectFields, populate);

    const res = CommonHelper.formatResponse({
      action: "findOne",
      result: user,
    });
    return response
      .status(res.status)
      .json({ message: res.message, payload: user });
  } catch (error) {
    return response.status(500).json({ error, message: "Internal error." });
  }
};

/*
| Edit admin user 
*/
exports.editUser = async (request, response, next) => {
  try {
    for (let key in request.body) {
      if (updateFields.findIndex((v) => v === key) === -1) {
        return response
          .status(ConstantHelper.HttpCodeAndMessage["INVALID"].code)
          .json({ message: ConstantHelper.HttpCodeAndMessage["INVALID"].en });
      }
    }

    const filter = { _id: request.query._id };
    const exist = await AdminService.findOne(filter, "_id");
    if (!exist)
      return response
        .status(ConstantHelper.HttpCodeAndMessage["NOT_FOUND"].code)
        .json({ message: ConstantHelper.HttpCodeAndMessage["NOT_FOUND"].en });

    const contactFilter = {
      _id: { $ne: request.query._id },
      contact: request.body.contact,
    };
    const contactExist = await AdminService.findOne(contactFilter, "_id");
    if (contactExist)
      return response
        .status(ConstantHelper.HttpCodeAndMessage["EXIST"].code)
        .json({ message: ConstantHelper.HttpCodeAndMessage["EXIST"].en });

    request.body["updatedBy"] = request.tokens.user._id;

    const result = await AdminService.updateOne(filter, request.body);
    const res = CommonHelper.formatResponse({ action: "updateOne", result });
    return response.status(res.status).json({ message: res.message });
  } catch (error) {
    return response.status(500).json({ error, message: "Internal error." });
  }
};



