import express from 'express'
import {makeInstructor} from '../controller/instructor'
//middlewares
import {requireSignin} from '../middlewares'


const router=express.Router();

//it checks the if any post occurs to this end point then the register controller function works
router.post('/make-instructor',requireSignin,makeInstructor)

module.exports = router