const mongoose = require("mongoose");
const md5 = require("md5");
const dotenv = require("dotenv");
dotenv.config();

// Models
const AdminModel = require("../models/admin");
const RestaurantSettingModel = require("../models/restaurant_setting");
const ConstantHelper = require("./../helpers/Constant");

// Services
const RestaurantService = require('./../service/Restaurant');
const AdminService = require("../service/Admin");
const adminAddFields = ['branch', 'name', 'email', 'contact', 'dialCode', 'type', 'password'];
const updateFields = [
  "restaurantName",
  "onlinePayment",
  "AcceptOnlinePayment",
  "streetlineDelivery",
  "tag",
  "status",
  "digitalMenuShortUrl",
  "fatoorah",
  "appThemeColors",
  "multiplexerId",
  "botToken"
];


/*
| Add  Restaurant User 
*/
exports.addRestaurantOwner = async (request, response, next) => {
  try {
    if (request.tokens && request.tokens.user && request.tokens.user.type !== 'it')
      return response
        .status(ConstantHelper.HttpCodeAndMessage['FORBIDDEN'].code)
        .json({ message: ConstantHelper.HttpCodeAndMessage['FORBIDDEN'].en });

    for (let key in request.body.restaurant) {
      if (RestaurantService.addFields.findIndex(v => v === key) === -1) {
        return response
          .status(ConstantHelper.HttpCodeAndMessage['INVALID'].code)
          .json({ message: ConstantHelper.HttpCodeAndMessage['INVALID'].en });
      };
    }

    for (let key in request.body.user) {
      if (adminAddFields.findIndex(v => v === key) === -1) {
        return response
          .status(ConstantHelper.HttpCodeAndMessage['INVALID'].code)
          .json({ message: ConstantHelper.HttpCodeAndMessage['INVALID'].en });
      };
    }

    const contactExist = await AdminService.findOne({ contact: request.body.user.contact });
    if (contactExist) {
      return response
        .status(ConstantHelper.HttpCodeAndMessage['EXIST'].code)
        .json({ message: 'Contact number already exist.' });
    }

    const resCount = await RestaurantService.findAll();
    let restaurantId = null;

    let i = 1;
    await checkRestaurantExist();

    async function checkRestaurantExist() {
      restaurantId = "R" + (resCount + i);
      const resExist = await RestaurantService.exist({ restaurantId });
      if (resExist) {
        i = i + 1;
        await checkRestaurantExist();
      }
    }

    const resSettingData = {
      _id: new mongoose.Types.ObjectId,
      restaurantId,
      restaurantName: request.body.restaurant.restaurantName,
    };
    const resSettings = await RestaurantService.add(resSettingData);

    const ownerData = {
      _id: new mongoose.Types.ObjectId,
      restaurantId,
      name: request.body.user.name,
      email: request.body.user.email,
      auth: Math.random().toString(36).slice(2),
      password: md5(request.body.user.password),
      contact: request.body.user.contact,
      type: 'owner',
      dialCode: request.body.user.dialCode,
      settings: resSettings._id,
    };

    const result = await AdminService.add(ownerData);
    return response.status(201).json({
      message: "Restaurant created",
      payload: result,
    });
  } catch (error) {
    return response.status(500).json({ error, msg: "Error in creating account." })
  }
};

/*
  Update Restaurant Settings
*/
exports.updateSettings = async (request, response, next) => {
  const params = request.query;
  const filter = {};
  let options = { upsert: true, new: true, setDefaultsOnInsert: true };

  for (let key in params) {
    if (params.hasOwnProperty(key)) filter[key] = params[key];
  }

  const settingsData = {};
  const data = request.body[request.body.type];
  for (let key in data) {
    if (data.hasOwnProperty(key) && (data[key] || data[key] === 0)) settingsData[key] = data[key];
  }

  if (request.body.type === "profile") {
    if (!request.tokens.user.settings.restaurantName) {
      const resName = {
        restaurantName: request.body[request.body.type].restaurantName,
      };
      let settingsFilter = {};
      if (request.tokens.user.settings)
        settingsFilter["_id"] = request.tokens.user.settings._id;
      else
        settingsFilter["_id"] = new mongoose.Types.ObjectId();

      RestaurantSettingModel.findOneAndUpdate(settingsFilter, resName, options).then(res => console.log('Restaurant name updated'));
    }

    AdminModel.findOneAndUpdate(filter, settingsData, { upsert: true })
      .populate("settings")
      .then((idUpdated) =>
        response
          .status(200)
          .json({ payload: idUpdated, message: "Updated successfully!" })
      )
      .catch((updateError) =>
        response.status(500).json({
          error: updateError,
          message: "Error in updating settings id",
        })
      );
  } else if (request.body.type === "account") {
    filter["password"] = md5(data.password);

    AdminModel.find(filter)
      .then((user) => {
        if (user.length < 1)
          return response
            .status(500)
            .json({ message: "Old password is invalid" });

        const accountUpdateData = {
          password: md5(data.newPassword),
        };

        AdminModel.findOneAndUpdate(filter, accountUpdateData)
          .then((idUpdated) =>
            response
              .status(200)
              .json({ message: "Account Updated successfully!" })
          )
          .catch((updateError) =>
            response.status(500).json({
              error: updateError,
              message: "Error in updating account detail",
            })
          );
      })
      .catch((findError) =>
        response.status(500).json({ error: findError, msg: "User not found" })
      );
  } else if (request.body.type === "general") {
    const generalSettingsFilter = {};

    if (params.settings) generalSettingsFilter["_id"] = params.settings;
    else {
      generalSettingsFilter["_id"] = new mongoose.Types.ObjectId();
      generalSettingsFilter["restaurantId"] = request.tokens.user.restaurantId;
    }

    RestaurantSettingModel.findOneAndUpdate(
      generalSettingsFilter,
      settingsData,
      options
    )
      .then((generalSettingsUpdated) => {
        const idData = { settings: generalSettingsUpdated._id };

        AdminModel.findOneAndUpdate(filter, idData)
          .populate("settings")
          .then((idUpdated) =>
            response.status(200).json({
              message: "Updated successfully!",
              payload: generalSettingsUpdated,
            })
          )
          .catch((updateError) =>
            response.status(500).json({
              error: updateError,
              message: "Error in updating settings id",
            })
          );
      })
      .catch((updateError) =>
        response
          .status(500)
          .json({ error: updateError, message: "Error in updating settings" })
      );
  }
};

/*
  Find restaurant
*/
exports.detail = async (request, response, next) => {
  try {
    const select = "_id restaurantName multiplexerId botToken";
    const query = { _id: request.query._id };
    const result = await RestaurantService.findOne(query, select);
    return response.status(200).json({ message: 'Restaurant detail.', payload: result });
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};

/**
 * Update restaurant
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
exports.update = async (request, response, next) => {
  try {
    const filter = { _id: request.query._id };

    for (let key in request.body) {
      if (updateFields.findIndex(v => v === key) === -1) {
        return response
          .status(400)
          .json({ message: 'Bad request.' });
      };
    }

    const payload = await RestaurantService.updateOne(filter, request.body);
    return response.status(200).json({ message: 'Restaurant updated.', payload });

  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Internal error." });
  }
};

/*
    Get Settings
*/
exports.getSettings = (request, response, next) => {
  console.log('dsdssvvfvfddfv');
  const { restaurantId } = request.query;
  RestaurantSettingModel.findOne({ restaurantId })
    .then((data) => {
      return response.status(200).json({ message: "ok", payload: data });
    })
    .catch((err) =>
      response
        .status(500)
        .json({ error: err, message: "Error in getting settings" })
    );
}




