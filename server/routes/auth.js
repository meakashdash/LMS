import express from 'express'
import {register,login,logout,currentUser,sendTestEmail,forgotPassword,resetPassword} from '../controller/auth'
//middlewares
import {requireSignin} from '../middlewares'


const router=express.Router();

//it checks the if any post occurs to this end point then the register controller function works
router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/current-user',requireSignin,currentUser)//remove requireSignin middlewares to work
router.get('/send-email',sendTestEmail)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)

module.exports = router