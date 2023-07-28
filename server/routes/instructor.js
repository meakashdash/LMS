import express from 'express'
import {makeInstructor,getAccountStatus,currentInstructor,instructorStudentCount,instructorBalance,instructorPayoutSettings} from '../controller/instructor'
//middlewares
import {requireSignin} from '../middlewares'


const router=express.Router();

//it checks the if any post occurs to this end point then the register controller function works
/**** Comment it for StripeInvalidRequestError ****/
// router.post('/make-instructor',requireSignin,makeInstructor)
router.post('/get-account-status',requireSignin,getAccountStatus)
router.get('/current-instructor',requireSignin,currentInstructor)
router.post('/instructor/student-count',requireSignin,instructorStudentCount)
router.get("/instructor/balance", requireSignin, instructorBalance);
router.get("/instructor/payout-settings",requireSignin,instructorPayoutSettings);
module.exports = router