import ApiError from "../errors/api.error";

const validate = (dtoClass) => {
  return (req, res, next) => {
    const { errors, value } = dtoClass.validate(req.body);
    if (errors) {
      return ApiError.badRequest(errors.join(", "));
    }
    req.body = value;
    next();
  };
};

export default validate;
