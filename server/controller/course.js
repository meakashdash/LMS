import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'
import slugify from 'slugify'
import Course from '../models/course.js'

const awsConfig={
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    region:process.env.AWS_REGION,
    apiVersion:process.env.AWS_API_VERSION,
  }

//create a new instance of AWS s3
const S3=new AWS.S3(awsConfig)

export const uploadImage=async(req,res)=>{
    try {
        const {image} =req.body
        //if image is not there then return error
        // console.log(image)
        if(!image) return res.status(400).send('No image')

        //get the binary format of the data
        const base64Data=new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""),'base64')

        //get the type of the image
        const type=image.split(';')[0].split('/')[1]

        //image params
        const params={
            Bucket:'lms-bucket-akash',
            Key:`${nanoid()}.${type}`,
            Body:base64Data,
            ACL:'public-read',
            ContentEncoding:'base64',
            ContentType:`image/${type}`
        }

        //Upload the data
        S3.upload(params,(err,data)=>{
            if(err){
                console.log(err)
                return res.sendStatus(400).json({error:"Upload to s3 failed"})
            }
            console.log(data)
            return res.send(data)
        })

    } catch (error) {
       console.log(error) 
    }
}

export const removeImage=async(req,res)=>{
    try {
        //get the image
        const {image}=req.body
        // console.log(image)
        //only we just want bucket and the key to delete the image
        const params={
            Bucket:image.Bucket,
            Key:image.Key
        }

        //delete the image from the bucket
        S3.deleteObject(params,(error,data)=>{
            if(error){
                console.log(error)
                toast.error("Image delete failed")
                return res.sendStatus(400)
            }
            return res.send({ok:true})
        })
    } catch (error) {
        console.log(error)
    }
}

//React for beginners
//After slogify --> react-for-beginners
export const create=async(req,res)=>{
    try {
        // console.log(req.body);
        //check if the course name is already exist or not
        const alreadyExist=await Course.findOne({
            slug:slugify(req.body.name.toLowerCase()),
        })
        console.log("ALREADY EXIST",alreadyExist)
        if(alreadyExist) return res.status(400).send("Title is taken");

        //create a new course
        const course=await new Course({
            slug:slugify(req.body.name),
            instructor:req.auth._id,
            ...req.body
        }).save();

        res.json(course);
    } catch (error) {
        console.log(error);
    }
}