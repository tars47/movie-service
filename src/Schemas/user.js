const common = {
  type: "object",
  properties: {
    email: { type: "string", minLength: 1, maxLength: 255, format: "email" },
    password: { type: "string", minLength: 1, maxLength: 255 },
  },
  required: ["email", "password"],
  additionalProperties: false,
};
/**
 *  @description -> JSON Schema for validating user/register request body data
 */
const register = common;

/**
 *  @description -> JSON Schema for validating user/login request body data
 */
const login = common;

module.exports = { register, login };
