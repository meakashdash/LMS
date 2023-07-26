import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'
import slugify from 'slugify'
import Course from '../models/course.js'
import {readFileSync} from 'fs'
import User from '../models/user.js'
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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
        const {title,content,video,free_preview}=req.body;

        if(req.auth._id != instructorId){
            return res.status(400).send("Unauthorized");
        }

        //if we dont add the new:true theby default it will return the old data
        const updated=await Course.findOneAndUpdate({slug},{
            $push:{lessons:{title,content,video,free_preview}}
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


export const publishCourse=async(req,res)=>{
    try {
        const {courseId}=req.params;
        const course=await Course.findById(courseId).exec();

        if(course.instructor!=req.auth._id){
            return res.status.send("Unauthorized");
        }

        const updated=await Course.findByIdAndUpdate(courseId,{published:true},{new:true}).exec();
        res.json(updated);
    } catch (error) {
        console.log(error);
        return res.status(400).send("Publish course failed"	)
    }
}

export const unpublishCourse=async(req,res)=>{
    try {
        const {courseId}=req.params;
        const course=await Course.findById(courseId).exec();

        if(course.instructor!=req.auth._id){
            return res.status.send("Unauthorized");
        }

        const updated=await Course.findByIdAndUpdate(courseId,{published:false},{new:true}).exec();
        res.json(updated);
    } catch (error) {
        console.log(error);
        return res.status(400).send("Publish course failed"	)
    }
}

export const courses=async(req,res)=>{
    try {
        const courses=await Course.find({published:true}).populate("instructor","_id name").exec();
        res.json(courses);
    } catch (error) {
        console.log(error);
        return res.status(400).send("Course fetch failed");
    }
}


export const removeLesson=async(req,res)=>{
    try {
        const {slug,lessonId}=req.params;
        const course=await Course.findOne({slug}).exec();
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (course.instructor != req.auth._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const lessonIndex = course.lessons.findIndex(lesson => lesson._id.toString() === lessonId);

        if(lessonIndex === -1){
            return res.status(404).json({ error: 'Lesson not found' });
        }

        const params={
            Bucket:course.lessons[lessonIndex].video.Bucket,
            Key:course.lessons[lessonIndex].video.Key,
        }

        S3.deleteObject(params,(error,data)=>{
            if(error){
                console.log(error);
                res.sendStatus(400).json({error:"Delete Lesson from S3 Failed"});
            }
            course.lessons.splice(lessonIndex, 1);
            course.save((err, updatedCourse) => {
                if (err) {
                  console.error('Error saving updated course:', err);
                  return res.status(500).json({ error: 'Internal server error' });
                }
        
                return res.json(updatedCourse);
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send("Remove Lesson Failed");
    }
}


export const checkEnrollent=async(req,res)=>{
    try {
        const {courseId}=req.params;
        const user=await User.findById(req.auth._id).exec();
        
        //check if the course is already enrolled or not
        let ids=[]
        for(let i=0; i < user.courses.length; i++){
            ids.push(user.courses[i].toString());
        }
        res.json({
            status:ids.includes(courseId),
            course:await Course.findById(courseId).exec()
        })
    } catch (error) {
        console.log(error);
        res.status(400).send("Check enrollment failed");
    }
}

export const freeEnrollment=async(req,res)=>{
    try {
        const {courseId}=req.params;
        const course=await Course.findById(courseId).exec();
        if(course.paid) return;

        const result=await User.findByIdAndUpdate(req.auth._id,{
            $addToSet:{courses:course._id}
        },{new:true}).exec();

        res.json({
            message:"Congratulations! You have successfully enrolled",
            course,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send("Free enrollment failed");
    }
}

export const paidEnrollment=async(req,res)=>{
    try {
        //get the course id
        const {courseId}=req.params;
        //get the course
        const course=await Course.findById(courseId).populate("instructor").exec();
        //check if paid or not
        if(!course.paid) return;
        //platform fee 30%
        const fee=(course.price*30)/100;
        //create a stripe session
        const session=await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            //purchase details
            line_items:[
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                          name: course.name, // Replace with the actual course name
                        },
                        unit_amount: Math.round(course.price.toFixed(2) * 100),
                      },
                    quantity: 1,
                },
            ],
            //specifying the mode
            mode: 'payment',
            //charge the buyer and transfer the remaining fee to the instructor
            payment_intent_data:{
                application_fee_amount:Math.round(fee.toFixed(2)*100),
                transfer_data:{
                    destination:course.instructor.stripe_account_id
                },
            },
            //success and cancel url
            success_url:`${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
            cancel_url:process.env.STRIPE_CANCEL_URL,
        })
        console.log("SESSION",session);
        //save in the user database
        await User.findByIdAndUpdate(req.auth._id,{stripeSession:session}).exec();
        res.send(session.id);
    } catch (error) {
        console.log(error);
        res.status(400).send("Paid enrollment failed");
    }
}

export const stripeSuccess=async(req,res)=>{
    try {
        //get the course
        const {courseId}=req.params;
        //find the user
        const user=await User.findById(req.auth._id).exec();
        //get the course
        const course=await Course.findById(courseId).exec();
        //If no stripe session return
        if(!user.stripeSession.id) return res.sendStatus(400);
        //retrieve the stripe session
        const session=await stripe.checkout.sessions.retrieve(user.stripeSession.id); 
        // {CHECK THIS LINE LATER}

        //if the paymentStatus is paid then push the course into the users course array
        if(session.payment_status === 'paid'){  //{CHECK THIS LINE LATER "true" is replaced by session.payment_status === 'paid'}
            await User.findByIdAndUpdate(req.auth._id,{
                $addToSet:{courses:course._id},
                $set:{stripeSession:{}},
            },{new:true}).exec();
        }
        res.json({success:true,course});
    } catch (error) {
        console.log(error);
        res.json({success:false});
    }
}

export const userCourses=async(req,res)=>{
    try {
        const user=await User.findById(req.auth._id).exec();
        console.log(user.courses);
        const courses=await Course.find({_id:{$in:user.courses}}).populate("instructor","_id name").exec();
        // console.log(courses)
        res.json(courses);
    } catch (error) {
        console.log(error);
        res.status(400).send("User courses fetch failed");
    }
}


