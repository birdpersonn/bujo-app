const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateRegisterInput = (data) => {
  let errors = {};

  // check email field
  if (isEmpty(data.email)) {
    errors.email = "email field cannot be empty";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "email is invalid, please provide a valid email";
  }

  // check name field
  if (isEmpty(data.name)) {
    errors.name = "name cannot be empty";
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "name must be between 2 and 30 characters long";
  }

  // check password field
  if (isEmpty(data.password)) {
    errors.password = "password field cannot be empty";
  } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
    errors.password = "password must be between 6 and 150 characters long";
  }

  // check confirm password field
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "confirm password field cannot be empty";
  } else if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "password fields must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateRegisterInput;
