import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'
import slugify from 'slugify'
import Course from '../models/course.js'
import {readFileSync} from 'fs'

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

export const instructorCourses=async(req,res)=>{
    try {
        const courses=await Course.find({instructor:req.auth._id}).sort({createdAt:-1}).exec();
        res.json(courses);
    } catch (error) {
        console.log(error)
    }
}


export const read=async(req,res)=>{
    try {
        const course=await Course.findOne({slug:req.params.slug}).populate("instructor","_id name").exec();
        res.json(course);
    } catch (error) {
        console.log(error);
    }
}

export const uploadVideo=async(req,res)=>{
    try {

        //check if the video uploaded by instructor or not
        if(req.auth._id!=req.params.instructorId){
            return res.status(400).send("Unauthorized");
        }


        const {video}=req.files;
        // console.log(video);
        if(!video){
            return res.status(400).send("No video");
        }

        const params={
            Bucket:'lms-bucket-akash',
            Key:`${nanoid()}.${video.type.split('/')[1]}`,
            Body:readFileSync(video.path),
            ACL:'public-read',
            ContentType:video.type
        }

        S3.upload(params,(error,data)=>{
            if(error){
                console.log(error);
                return res.sendStatus(400).json({error:"Upload to s3 failed"});
            }
            console.log(data);
            return res.send(data);
        });
    } catch (error) {
        console.log(error)
    }
}

export const removeVideo=async(req,res)=>{
    try {


        //check if the video uploaded by instructor or not
        if(req.auth._id!=req.params.instructorId){
            return res.status(400).send("Unauthorized");
        }


        const {Bucket,Key}=req.body;

        const params={
            Bucket,
            Key,
        }

        S3.deleteObject(params,(error,data)=>{
            if(error){
                console.log(error);
                res.sendStatus(400).json({error:"Upload to s3 failed"});
            }
            console.log(data);
            res.send({ok:true});
        });
    } catch (error) {
        console.log(error)
    }
}


export const addLesson=async(req,res)=>{
    try {
        const {slug,instructorId}=req.params;
        const {title,content,video}=req.body;

        if(req.auth._id != instructorId){
            return res.status(400).send("Unauthorized");
        }

        //if we dont add the new:true theby default it will return the old data
        const updated=await Course.findOneAndUpdate({slug},{
            $push:{lessons:{title,content,video}}
        },{new:true}).populate("instructor","_id name").exec();

        res.json(updated);
    } catch (error) {
        console.log(error);
        return res.status(400).send("Add Lesson Failed");
    }
}


export const update=async(req,res)=>{
    try {
        const {slug}=req.params;

        const course=await Course.findOne({slug}).exec();

        if(req.auth._id != course.instructor){
            return res.status(400).send("Unauthorized");
        }

        const updated=await Course.findOneAndUpdate({slug},req.body,{new:true}).exec();

        res.json(updated);
    } catch (error) {
        console.log(error);
        return res.status(400).send("Course update failed");
    }
}

