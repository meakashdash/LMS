import express from 'express'
import {uploadImage,removeImage,create} from '../controller/course'
//middlewares

import {requireSignin,isInstructor} from '../middlewares'


const router=express.Router();

//it checks the if any post occurs to this end point then the register controller function works
//for images
router.post('/course/upload-image',uploadImage)
router.post('/course/remove-image',removeImage)

//for the course
router.post('/course',requireSignin,isInstructor,create)

module.exports = router