import {expressjwt} from 'express-jwt'
import User from '../models/user.js'
import Course from '../models/course.js'

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

//middleware to check if the user is enrolled or not
export const isEnrolled=async(req,res,next)=>{
    try {
        const user=await User.findById(req.auth._id).exec();
        const course=await Course.findOne({slug:req.params.slug}).exec();

        let ids=[];
        for(let i=0;i<user.courses.length;i++){
            ids.push(user.courses[i].toString());
        }

        if(!ids.includes(course._id.toString())){
            return res.sendStatus(403);
        }else{
            next();
        }
    } catch (error) {
        console.log(error);
    }
}


