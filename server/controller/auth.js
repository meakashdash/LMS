
import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk'
//importing this package for creating the short code
import {nanoid} from 'nanoid'

//to help to connect to the aws account
const awsConfig={
  accessKeyId:process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  region:process.env.AWS_REGION,
  apiVersion:process.env.AWS_API_VERSION,
}

//access the SES functionality
const SES=new AWS.SES(awsConfig)

export const register = async (req, res) => {
  try {
    // console.log(req.body);
    // //destructure all the property
    const { name, email, password } = req.body;
    // validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }
    ////find the existing user to prevent duplicate
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");

    // hash password
    const hashedPassword = await hashPassword(password);

    // register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    // console.log("saved user", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login=async(req,res)=>{
  try {
    // console.log(req.body)
    const {email,password} = req.body
    //first find the user if present or not in the database
    const user=await User.findOne({email}).exec();
    if(!user){
      return res.status(400).send("User not found")
    }
    //if the user is present then check the password
    const match=await comparePassword(password,user.password)
    if(!match){
      return res.status(400).send({message:'Wrong password try again'})
    }
    //now the user is  verified and now we can send the jwt token and send back to the client
    //for further authorization
    //In the first argument we send the user id as content when we verified then we can access this content
    const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{
      expiresIn:"7d",
    })
    //return user and token to client and exclude password
    user.password=undefined
    //send token in cookie bcz of that it can't accessible
    res.cookie("Token",token,{
      httpOnly:true
    })

    //send user as response
    res.json(user)

  } catch (error) {
    console.log(error);
    res.status(400).send("Error. Try again.");
  }
}

export const logout=async(req, res) => {
  try {
    res.clearCookie("Token")
    return res.json({message:"Log out success"})
  } catch (error) {
    console.log(error);
    res.status(400).send("Error.  Try again");
  }
}

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).select("-password").exec();
    console.log("CURRENT_USER",user);
    return res.json({ok:true});
  } catch (err) {
    console.log(err);
  }
};


export const sendTestEmail=async(req,res)=>{
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: ['akashdash279@gmail.com'],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <html>
              <h1> Reset Password Link </h1>
              <p> Kindly use the link below to reset your password <p/>
            </html>
          `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Reset Password Link`,
      },
    },
  };

    const emailSent= SES.sendEmail(params).promise()
    emailSent.then((data)=>{
      console.log(data)
      res.json({ok:true})
    })
    .catch((err)=>{
      console.log(err)
    })
}

export const forgotPassword=async(req,res)=>{
  try {
    const {email}=req.body
    //creating the shoertcode of 6 length and uppercase
    const shortCode=nanoid(6).toUpperCase()
    //store in the database by findOneAndUpdate(filter,update)
    const user=await User.findOneAndUpdate({email},{
      passwordResetCode:shortCode
    })

    //if there is no user found we return an error
    if(!user){
      return res.status(400).send("User not found")
    }

    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      ReplyToAddresses: [process.env.EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <html>
                <h1> Reset Password Link </h1>
                <p> Use this code to reset your password <p/>
                <h2 style="color:red;">${shortCode}</h2>
                <i>yourwebsite.com</i>
              </html>
            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Reset Your Password`,
        },
      },
    };

    const emailSent= SES.sendEmail(params).promise()

    emailSent.then((data)=>{
      console.log(data)
      res.json({ok:true})
    })
    .catch((err)=>{
      console.log(err)
    })

  } catch (error) {
    console.log(error)
    res.status(404).send({message:'Error in forgetting the password'})
  }
}

export const resetPassword=async(req,res)=>{
  try {
    const {email,code,newPassword}=req.body
    const hashedNewPassword=await hashPassword(newPassword)
    const user=await User.findOneAndUpdate({email,passwordResetCode:code},{
      password:hashedNewPassword,
      passwordResetCode:''
    }).exec()

    res.status(200).send({message:'Successfully resetting the code'})
  } catch (error) {
    console.log(error)
    res.status(404).send({message:'Error in resetting the password'})
  }
}