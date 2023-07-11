import {expressjwt} from 'express-jwt'
import User from '../models/user.js'

//this middleware is used for generating the token and check the secret key
//if both valid then we have access to req.user from where we can get the _id
export const requireSignin=expressjwt({
    getToken:(req,res)=>req.cookies.Token, 
    secret:process.env.JWT_SECRET,
    algorithms:["HS256"],
})

//middleware to check if the user is instructor or not
export const isInstructor=async(req,res,next)=>{
    try {
        const user=await User.findById(req.auth._id).exec();
        if(!user.role.includes('Instructor')){
            return res.sendStatus(403);
        }
        else{
            next();
        }
    } catch (error) {
        console.log(error);
    }
}


