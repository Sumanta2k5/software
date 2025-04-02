const UserModel = require("../Models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const { use } = require("../Routes/AuthRouter");

const signup= async (req, res) => {
    try {
        const { name,email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists" ,success:false});
        }
        const userModel=new UserModel({name,email,password});
        userModel.password=await bcrypt.hash(password,10);
        await userModel.save();
        res.status(201).json({ message: "Signup successfully" ,success:true});
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" ,success:false});   
    }
}
const login= async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "Authentication fail: email or password is wrong" ,success:false});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(403).json({ message: "Authentication fail: email or password is wrong" ,success:false});
        }


        const jwtToken=jwt.sign({email:user.email,_id:user._id},process.env.JWT_SECRET,{expiresIn:'24h'});
        res.status(200).json({ message: "Login success" ,success:true,jwtToken,email,name:user.name,userId: user._id,role:user.role,profilePic:user.profilePic});
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" ,success:false});   
    }
}

        module.exports={signup,login};