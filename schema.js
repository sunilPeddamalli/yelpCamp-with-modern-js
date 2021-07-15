const Joi = require('joi');

module.exports.catchErrorSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
})