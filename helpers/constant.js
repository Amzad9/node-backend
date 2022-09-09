const Configuration = [
    {
      day: "Sunday",
      status: false,
      config: [{ open: "12:00 AM", close: "11:59 PM" }],
    },
    {
      day: "Monday",
      status: false,
      config: [{ open: "12:00 AM", close: "11:59 PM" }],
    },
    {
      day: "Tuesday",
      status: false,
      config: [{ open: "12:00 AM", close: "11:59 PM" }],
    },
    {
      day: "Wednesday",
      status: false,
      config: [{ open: "12:00 AM", close: "11:59 PM" }],
    },
    {
      day: "Thursday",
      status: false,
      config: [{ open: "12:00 AM", close: "11:59 PM" }],
    },
    {
      day: "Friday",
      status: false,
      config: [{ open: "12:00 AM", close: "11:59 PM" }],
    },
    {
      day: "Saturday",
      status: false,
      config: [{ open: "12:00 AM", close: "11:59 PM" }],
    },
  ];
  
  const HttpCodeAndMessage = {
    OK: {
      code: 200,
      en: 'Success.',
      ar: 'نجاح'
    },
    NOT_MODIFIED: {
      code: 304,
      en: 'Not modified.',
      ar: 'لم يتم تعديله'
    },
    INVALID: {
      code: 400,
      en: 'Bad request.',
      ar: 'اقتراح غير جيد'
    },
    FORBIDDEN: {
      code: 403,
      en: 'You cannot perform this action.',
      ar: 'لا يمكنك تنفيذ هذا الإجراء'
    },
    NOT_FOUND: {
      code: 404,
      en: 'Resource not found.',
      ar: 'لم يتم العثور على المورد.'
    },
    EXIST: {
      code: 409,
      en: 'Already exist.',
      ar: 'موجود بالفعل'
    }
  }
  
  module.exports = {
    Configuration,
    HttpCodeAndMessage
  };