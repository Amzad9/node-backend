const Constant = require("./../helpers/constant");

function padZero(value) {
  let pad = "";
  if (value > 0 && value < 10) pad = "0000";
  if (value > 9 && value < 100) pad = "000";
  if (value > 99 && value < 1000) pad = "00";
  if (value > 999 && value < 10000) pad = "0";

  return pad + value;
}

function handleError(err) {
  const x = Object.entries(err);

  const res = [];

  x.forEach((v) => {
    v.forEach((w) => {
      if (!w.path) return;

      res.push({
        key: w.path,
        message: w.message,
      });
    });
  });

  return res;
}

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function grandTotal(data) {
  let total = 0;
  total +=
    data.totalPrice +
    (data.vatAmount || 0) +
    (data.customizerAmount || 0) +
    (data.deliveryCharge || 0) +
    data.vatOnDelivery -
    (data.totalDiscount || 0);

  return total;
}

function orderStatus(key) {
  statusAndDes = {
    pending: "Order Pending",
    rejected: "Order Rejected",
    accepted: "Order Accepted",
    being_prepared: "Order Being Prepared",
    pickup_ready: "Order Pickup Ready",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    not_delivered: "Not delivered",
    completed: "Order Completed",
    cancelled: "Order Cancelled",
    awaiting_payment: "Awaiting Payment",
    payment_completed: "Payment Completed",
    payment_cancelled: "Payment Cancelled",
  };

  return statusAndDes[key];
}

function branchOpeningHours(from, to) {
  const openingHours = [];

  if (from === "00:00") {
    from = "12:00 AM";
    to = "11:59 PM";
  } else {
    const openTime = parseInt(from.split(":")[0], 10);
    const closeTime = parseInt(to.split(":")[0], 10);

    if (openTime < 12) from = from + " AM";
    else from = "0" + (openTime - 12) + ":00 PM";

    if (closeTime < 12) to = to + " AM";
    else to = "0" + (closeTime - 12) + ":00 PM";
  }

  Constant.Configuration.forEach((c) => {
    openingHours.push({
      day: c.day,
      status: true,
      config: [
        {
          open: from,
          close: to,
        },
      ],
    });
  });

  return openingHours;
}

function formatResponse(params) {
  let codeMessage = {};

  switch (params.action) {
    case "findOne":
      if (params.result) codeMessage = Constant.HttpCodeAndMessage["OK"];
      else codeMessage = Constant.HttpCodeAndMessage["NOT_FOUND"];
      break;

    case "updateOne":
      if (params.result.n < 1)
        codeMessage = Constant.HttpCodeAndMessage["NOT_FOUND"];
      else if (params.result.nModified < 1)
        codeMessage = Constant.HttpCodeAndMessage["NOT_MODIFIED"];
      else codeMessage = Constant.HttpCodeAndMessage["OK"];
      break;
  }
  return {
    status: codeMessage.code,
    message: codeMessage[params.language || "en"],
  };
}

function separateDialCodeAndNumber(data) {
  if (data.length === 10) return { dialCode: '91', contact: data };
  if (data.length === 9) return { dialCode: '966', contact: data };

  const countryDialCodes = [
    {
      country: 'IN',
      dialCode: '91',
      contactLength: 12,
    }
  ];

  const result = countryDialCodes.filter(code =>
    (data.length === code.contactLength) && (data.substring(0, code.dialCode.length) === code.dialCode)
  )[0];

  return { dialCode: result.dialCode, contact: data.substring(result.dialCode.length, data.length) };
}

module.exports = {
  padZero,
  handleError,
  pad,
  grandTotal,
  orderStatus,
  branchOpeningHours,
  formatResponse,
  separateDialCodeAndNumber,
};
