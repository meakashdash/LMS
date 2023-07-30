import express from 'express'
import {uploadImage,
    removeImage,
    create,
    instructorCourses,
    read,
    uploadVideo,
    removeVideo,
    addLesson,
    update,
    publishCourse,
    unpublishCourse,
    courses,
    removeLesson,
    checkEnrollent,
    freeEnrollment,
    paidEnrollment,
    stripeSuccess,
    userCourses,
    markCompleted,
    listCompleted,
    markIncompleted} from '../controller/course'
//middlewares

import {requireSignin,isInstructor,isEnrolled} from '../middlewares'
import formidable from 'express-formidable'


const router=express.Router();


router.get('/courses',courses)

//it checks the if any post occurs to this end point then the register controller function works
//for images
router.post('/course/upload-image',uploadImage);
router.post('/course/remove-image',removeImage);

//for the course
router.post('/course',requireSignin,isInstructor,create);
//for the update course
router.put('/course/:slug',requireSignin,update)
//creating the route for fetching the courses
router.get('/instructor-courses',requireSignin,instructorCourses);
//for getting the specific course
router.get('/course/:slug',read);
//for upload the video
router.post('/course/upload-video/:instructorId',requireSignin,formidable(),uploadVideo);
//for remove the video
router.post('/course/remove-video/:instructorId',requireSignin,removeVideo);
//for adding lesson in the database
router.post('/course/lesson/:slug/:instructorId',requireSignin,addLesson);

//for publish and unpublish the course
router.put('/course/publish/:courseId',requireSignin,publishCourse);
router.put('/course/unpublish/:courseId',requireSignin,unpublishCourse);

//for deleting the lessons
router.put('/course/:slug/:lessonId',requireSignin,removeLesson);

//for checking the user is enrolled or not
router.get('/check-enrollment/:courseId',requireSignin,checkEnrollent);

//for doing the free-enrollment
router.post('/free-enrollment/:courseId',requireSignin,freeEnrollment);
//for doing the paid-enrollment
router.post('/paid-enrollment/:courseId',requireSignin,paidEnrollment);

//for the stripe success
router.get('/stripe-success/:courseId',requireSignin,stripeSuccess);

//for getting the user courses
router.get('/user-courses',requireSignin,userCourses);
//for the enrolled users learning page
router.get('/user/course/:slug',requireSignin,isEnrolled,read);

//mark completed/incompleted
router.post('/mark-completed',requireSignin,markCompleted);


//list completed
router.post('/list-completed',requireSignin,listCompleted);

router.post('/mark-incompleted',requireSignin,markIncompleted);

module.exports = router