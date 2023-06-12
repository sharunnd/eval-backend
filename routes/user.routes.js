const express = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { BlacklistModel } = require("../models/blacklist.model");
require("dotenv").config()

const userRouter = express.Router()


userRouter.post("/register", async(req,res)=>{
    const {email,age,password,gender,is_married,city,name} = req.body;
    
        try {
            const user = await UserModel.findOne({email})
            if(user){
                res.status(200).json({msg:"User already exist, please login",})
            }else{
                bcrypt.hash(password, 5, async(err, hash)=> {
                   if(err){
                      res.status(200).json({error:err.message})

                   }else{
                    const user = new UserModel({email,age,password:hash,gender,is_married,city,name})
                    await user.save()
                   res.status(200).json({msg:"User has been registered"})
                   }

                });
            }
        } catch (error) {
            res.status(400).json({error:error.message})
            
        }
    
})

userRouter.post("/login", async(req,res)=>{
    const {email,age,password,gender,is_married,city,name} = req.body;
    
        try {
            const user = await UserModel.findOne({email})
            if(user){
                bcrypt.compare(password, user.password, function(err, result) {
                    if(result){
                        const token = jwt.sign({ userID: user._id, user:user.name }, process.env.secretKey,{
                            expiresIn: "7d"
                        });
                        res.status(200).json({msg:"Logged in successfully",token})

                    }else{
                      res.status(200).json({msg:"wrong credentialas"})

                    }
                }); 
            }else{
               res.status(200).json({msg:"User not found!"})

            }
            
        } catch (error) {
            res.status(400).json({error:error.message})
            
        }
    
})

userRouter.post("/logout", async(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1]

       
        try {
            const blacklist = new BlacklistModel({token})
            await blacklist.save()
            res.status(200).json({msg:"user has been logged out"})
            
        } catch (error) {
            res.status(400).json({error:error.message})
            
        }
    
})
module.exports = {
    userRouter
}