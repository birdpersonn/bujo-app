const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateTaskInput = (data) => {
  let errors = {};

  // check content field
  if (isEmpty(data.content)) {
    errors.content = "content field can not be empty";
  } else if (!Validator.isLength(data.content, { min: 1, max: 300 })) {
    errors.content = "content field must be between 1 and 300 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateTaskInput;
