const joi = require('@hapi/joi');

module.exports.RegistrationValidation = (data) => {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6)
    })
    return schema.validate(data);
}

module.exports.LoginValidation = (data) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password : joi.string().required()
    })
    return schema.validate(data)
}