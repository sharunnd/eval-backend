
const jwt = require('jsonwebtoken');
const { BlacklistModel } = require('../models/blacklist.model');
require("dotenv").config()

const auth = async(req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    const blacklisttoken = await BlacklistModel.findOne({token})
    if(token){
        if(blacklisttoken){
            res.status(200).json({msg:"please login"})
        }
        const decoded = jwt.verify(token, process.env.secretKey);
  
        if(decoded){
            req.body.userID = decoded.userID;
            req.body.user = decoded.user;
            next()
        }else{
           res.status(200).json({msg:"Wrong credentials"})
        }
        
    }else{
        res.status(200).json({msg:"Please login!"})
    }
}

module.exports = {
    auth
}