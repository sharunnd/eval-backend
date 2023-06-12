const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const { PostModel } = require("../models/post.model");
const { UserModel } = require("../models/user.model");

const postRouter = express.Router()

postRouter.post("/add",auth, async(req,res)=>{

    try {
        const post = new PostModel(req.body)
        await post.save()
        res.status(200).json({msg:"new post added"})
    } catch (error) { 
        res.status(400).json({error:error.message})
        
    }
})

postRouter.get("/",auth, async(req,res)=>{
    const {min,max} = req.query
    const id = req.body.userID
    try {
        const posts = await PostModel.find({userID:id})
        res.status(200).json({msg:"All the posts ",posts})
    } catch (error) { 
        res.status(400).json({error:error.message})
        
    }
})


postRouter.patch("/update/:id",auth, async(req,res)=>{
    const {id} = req.params
    const useridindoc = req.body.userID
    try {
        const post = await PostModel.findOne({_id:id})
        const postidinpost = post.userID
        //  res.json({id})
        
        if(postidinpost === useridindoc){
            await PostModel.findByIdAndUpdate({_id:id},req.body)
            res.status(200).json({msg:"Post has been updated"})
        }else{
            res.status(200).json({msg:"not authorized"})
        }
    } catch (error) { 
        res.status(400).json({error:error.message})
        
    }
})

postRouter.delete("/delete/:id",auth, async(req,res)=>{
    const {id} = req.params;
    const useridindoc = req.body.userID
    try {
        const post = await PostModel.findOne({_id:id})
        const postidinpost = post.userID
 
        if(postidinpost === useridindoc){
            await PostModel.findByIdAndDelete({_id:id})
            res.status(200).json({msg:"Post has been deleted"})
        }else{
            res.status(200).json({msg:"not authorized"})
        }
    } catch (error) { 
        res.status(400).json({error:error.message})
        
    }
})


module.exports = {
    postRouter
}