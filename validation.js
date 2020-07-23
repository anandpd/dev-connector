const joi = require("@hapi/joi");

/**
 * @description - Auth Validation(Registratiion)
 ************************************************************/
module.exports.RegistrationValidation = (data) => {
  const schema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6),
  });
  return schema.validate(data);
};

/**
 * @description - Auth Validation(Login)
 ************************************************************/
module.exports.LoginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  return schema.validate(data);
};

/**
 * @description - Profile Validation(Adding a Profile)
 ************************************************************/
module.exports.ProfileValidation = (data) => {
  const schema = joi.object({
    status: joi.string().required(),
    skills: joi.required(),
  });
  return schema.validate(data);
};

/**
 * @description - Experience Validation
 ************************************************************/
module.exports.ExperienceValidation = (data) => {
  const schema = joi.object({
    title: joi.string().required(),
    company: joi.string().required(),
    from: joi.string().required(),
  });
  return schema.validate(data);
};

/**
 * @description - Education Validation
 ************************************************************/
module.exports.EducationValidation = (data) => {
  const schema = joi.object({
    school: joi.string().required(),
    degree: joi.string().required(),
    fieldofstudy: joi.string().required(),
    from: joi.string().required(),
  });
  return schema.validate(data);
};

/**
 * @description - New Post Validation
 ************************************************************/
module.exports.PostValidation = (data) => {
  const schema = joi.object({
    text: joi.string().required(),
  });
  return schema.validate(data);
};
