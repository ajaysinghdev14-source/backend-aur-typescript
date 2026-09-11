import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto";

class RegisterDto extends BaseDto {
  static schema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
      .message("Password must be at least 6 characters long")
      .min(6)
      .required(),
    role: Joi.string().valid("user", "admin").default("user"),
  });
}

export default RegisterDto;
