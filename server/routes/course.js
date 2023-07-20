import express from 'express'
import {uploadImage,removeImage,create,instructorCourses,read,uploadVideo,removeVideo} from '../controller/course'
//middlewares

import {requireSignin,isInstructor} from '../middlewares'
import formidable from 'express-formidable'


const router=express.Router();

//it checks the if any post occurs to this end point then the register controller function works
//for images
router.post('/course/upload-image',uploadImage);
router.post('/course/remove-image',removeImage);

//for the course
router.post('/course',requireSignin,isInstructor,create);
//creating the route for fetching the courses
router.get('/instructor-courses',requireSignin,instructorCourses);
//for getting the specific course
router.get('/course/:slug',read);
//for upload the video
router.post('/course/upload-video',requireSignin,formidable(),uploadVideo);
//for remove the video
router.post('/course/remove-video',requireSignin,removeVideo);

module.exports = router