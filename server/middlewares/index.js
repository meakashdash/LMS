import {expressjwt} from 'express-jwt'

//this middleware is used for generating the token and check the secret key
//if both valid then we have access to req.user from where we can get the _id
export const requireSignin=expressjwt({
    getToken:(req,res)=>req.cookies.Token, 
    secret:process.env.JWT_SECRET,
    algorithms:["HS256"],
})


