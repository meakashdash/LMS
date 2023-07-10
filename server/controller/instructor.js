import User from '../models/user'
import queryString from 'query-string'
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);



export const makeInstructor=async(req,res)=>{
    try {
        //1.find the user from the database
    const user=await User.findById(req.auth._id).exec();
    //2. if the user dont have stripe_account_id then create a new one
    if(!user.stripe_account_id){
        const account=await stripe.accounts.create({type:'standard'})
        console.log("ACCOUNT=>",account)
        user.stripe_account_id=account._id
        user.save()
    }
    //3. create account link based on the account id(for frontend to send the response)
   let accountLink=await stripe.accountLinks.create({
        account:user.stripe_account_id,
        refresh_url:process.env.STRIPE_REDIRECT_URL,
        return_url:process.env.STRIPE_REDIRECT_URL,
        type:"account_onboarding",
    })
    //4. prefill email(optional) then send url indo to the frontend
    accountLink=Object.assign(accountLink,{
        "stripe_user[email]":user.email,
    })
    //5.then send the accout link as response to the frontend
    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`)
    } catch (error) {
        console.log("MAKE INSTRUCTOR ERROR=>",error)
    }
}