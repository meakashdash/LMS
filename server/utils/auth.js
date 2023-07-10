import bcrypt from 'bcrypt'

//These are the utility functions used in the normal flow 


//first password converts to hash password and store in the database
export const hashPassword=(password)=>{
    //create a new promise
    return new Promise((resolve, reject)=>{
        //takes resolve and reject and salt is strength set to 12
        bcrypt.genSalt(12,(err,salt)=>{
            //if error occurs
            if(err){
                reject(err)
            }
            //otherwise it takes pass and salt then hashed it
            bcrypt.hash(password,salt,(err,hash)=>{
                if(err){
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

//after login the stored password is compare with the entered hashed converted password
export const comparePassword=(password,hashed)=>{
    return bcrypt.compare(password,hashed);
}