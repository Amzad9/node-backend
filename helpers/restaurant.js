const IntegrationModel = require("../models/integration");
const axios = require("axios");

class Restaurant {
  constructor(user) {
    this.user = user;
    this.integrationData = null;
    this.otherRestaurantData = [];
  }

  setToken(data) {
    this.integrationData = data;
  }

  async token() {
    try {
      if (this.integrationData) return;

      const filter = {
        restaurant: this.user.settings._id,
        slug: "other",
      };

      this.integrationData = await IntegrationModel.findOne(filter).select(
        "tokenType oauthToken"
      );

      if (!this.integrationData.oauthToken)
        throw { status: 501, message: "Cannot find token." };
    } catch (error) {
      throw { status: 500, message: "Internal error." };
    }
  }

  getRestaurantConfig(method, url, params = null, data = null) {
    let config = {
      baseURL: process.env.API_URL + "v5/",
      url,
      method,
      params,
      headers: {
        Authorization: `${this.integrationData.tokenType} ${this.integrationData.oauthToken}`,
      },
      responseType: "json",
    };

    switch (method) {
      case "GET":
        break;

      case "POST":
      case "PUT":
        config["data"] = data;
        break;
    }

    return config;
  }

  async handlePagination(method, path, params = null) {
    try {
      const config = this.getRestaurantConfig(method, path, params);

      const result = await axios(config);
      this.otherRestaurantData = this.otherRestaurantData.concat(result.data.data);
      const links = result.data.links;

      if (!links.next) return;

      const page = links.next.split("?");
      params["page"] = page[1].split("=")[1];
      await this.handlePagination(method, path, params);
    } catch (error) {
      console.log(error);
      throw {
        status: error.status || error.response.status,
        message: error.message || error.response.data.message,
      };
    }
  }
}

function isOtherRestaurant(data) {
  let result = false;

  if (!data.settings.integration) return false;

  data.settings.integration.forEach((v) => {
    if (v.slug === "other" && v.isActive) result = true;
  });

  return result;
}

module.exports = {
  Restaurant,
  isOtherRestaurant
};
