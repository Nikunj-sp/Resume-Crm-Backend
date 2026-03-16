import express from "express";
import Admin from "../models/admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

const router = express.Router();

router.post("/login", async (req,res)=>{
    try {
        const {email, password} = req.body;

        const admin = await Admin.findOne({email});
        
        if(!admin){
            return res.status(401).json({message: "Invalid Credentials"})
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Credentials"})
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "15m" }
        );
        res.json({token});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"})
    }
})

export default router;