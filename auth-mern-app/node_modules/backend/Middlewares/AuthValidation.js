const Joi=require('joi');

const signupValidation=(req,res,next)=>{
    const Schema=Joi.object({
        name:Joi.string().min(3).max(100).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(4).required()
    });
    const {error}=Schema.validate(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    next();

}


const loginValidation=(req,res,next)=>{
    const Schema=Joi.object({
       
        email:Joi.string().email().required(),
        password:Joi.string().min(4).required()
    });
    const {error}=Schema.validate(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    next();

}
module.exports={signupValidation,loginValidation}
