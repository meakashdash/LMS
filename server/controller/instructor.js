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
        user.stripe_account_id=account.id
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

export const getAccountStatus=async(req,res)=>{
    try {
        //find the user from the database
        const user=await User.findById(req.auth._id).exec()
        //get the updated stripe account status
        const account=await stripe.accounts.retrieve(user.stripe_account_id)
        //check user has completed all the requirements
        if(!account.charges_enabled){
            return res.status(401).send('Unauthorized')
        }
        else{
            //set the stripe_seller info in cloud
            const statusUpdated=await User.findByIdAndUpdate(user._id,{
                stripe_seller:account,
                //addToset ensures no duplicates
                $addToSet:{role:'Instructor'},

            },{new:true}).exec();
            statusUpdated.password=undefined
            res.json(statusUpdated)
        }
    } catch (error) {
        console.log(error)
    }
}

export const currentInstructor=async(req,res)=>{
    try {
        let  user=await User.findById(req.auth._id).select("-password").exec()
        if(!user.role.includes("Instructor")){
            return res.sendStatus(403)
        }
        else{
            res.json({ok:true})
        }

    } catch (error) {
        console.log(error)
    }
}


export const instructorStudentCount=async(req,res)=>{
    try {
        const user=await User.find({courses:req.body.courseId}).select("_id").exec()
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Instructor student count error');
    }
}

export const instructorBalance = async (req, res) => {
    try {
      let user = await User.findById(req.user._id).exec();
      const balance = await stripe.balance.retrieve({
        stripeAccount: user.stripe_account_id,
      });
      res.json(balance);
    } catch (err) {
      console.log(err);
    }
};

export const instructorPayoutSettings = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).exec();
      const loginLink = await stripe.accounts.createLoginLink(
        user.stripe_seller.id,
        { redirect_url: process.env.STRIPE_SETTINGS_REDIRECT }
      );
      res.json(loginLink.url);
    } catch (err) {
      console.log("stripe payout settings login link err => , err");
    }
  };