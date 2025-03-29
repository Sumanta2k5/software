const Joi = require("joi");

const regValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100),
        email: Joi.string().email().required(),
        role: Joi.string().valid("Professor", "Alumni", "Student").required(),
        media: Joi.any().optional(), // Profile pic is optional

        // Role-specific fields
        department: Joi.when("role", {
            is: Joi.valid("Professor", "Alumni", "Student"),
            then: Joi.string().required(),
            otherwise: Joi.forbidden(),
        }),
        graduationYear: Joi.when("role", {
            is: Joi.valid("Alumni", "Student"),
            then: Joi.number().integer().min(1900).required(),
            otherwise: Joi.forbidden(),
        }),
        currentJob: Joi.when("role", {
            is: "Alumni",
            then: Joi.string().required(),
            otherwise: Joi.forbidden(),
        }),
        program: Joi.when("role", {
            is: "Student",
            then: Joi.string().valid("B.Tech", "M.Tech", "Dual Degree", "PhD", "BSc").required(),
            otherwise: Joi.forbidden(),
        }),
        subjects: Joi.when("role", {
            is: Joi.valid("Professor"),
            then: Joi.array().items(Joi.string()).required(),
            otherwise: Joi.forbidden(),
        }),
        handlePage: Joi.when("role", {
            is: Joi.valid("Professor", "Alumni"),
            then: Joi.string().required(),
            otherwise: Joi.forbidden(),
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { regValidation };
