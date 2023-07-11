import express from 'express'
import cors from 'cors'
import {readdirSync}  from 'fs'
import mongoose from 'mongoose'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import {expressjwt} from 'express-jwt'
const morgan=require("morgan")
require("dotenv").config();



const app=express();


mongoose.connect(process.env.DATABASE,{
    // userNewUrlParser:true,
    // useFindAndModify:false,
    // useUnifiedTopology:true,
    // useCreateIndex:true,
}).then(()=>console.log("DB CONNECTED"))
.catch((err)=>console.log("DB CONNECTION ERROR",err))

const csrfProtection=csrf({cookie:true})

//middleware
app.use(cors());
app.use(express.json({limit:'5mb'}));
//for  csrf protection
app.use(cookieParser());

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));







// app.use(console.log("This is my own middleware"))
readdirSync("./routes").map((r)=>
    app.use("/api",require(`./routes/${r}`))
)

app.use(csrfProtection)

//create the end point for sending the token for every request
app.get('/api/csrf-token',(req,res)=>{
    res.json({csrfToken:req.csrfToken()})
})


const port=process.env.PORT||8000;

app.listen(port,()=>
    console.log(`server listening on ${port}`)
)