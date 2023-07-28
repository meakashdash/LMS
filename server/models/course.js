import mongoose from "mongoose";

const { Schema } = mongoose;

const lessonSchema=new Schema({
    title:{
        type:String,
        trim:true,
        minlength:[3,'Too short'],
        maxlength:[320,'Too long'],
        required:true,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    content:{
        type:{},
        minlength:[200,'Too short'],
        maxlength:[2000000,'Too long'],
    },
    video:{
        type:{},
        minlength:[32,'Too short'],
        maxlength:[2000000,'Too long'],
    },
    free_preview:{
        type:Boolean,
        default:false,
    },
},{timestamps:true})

const courseSchema=new Schema({
    name:{
        type:String,
        trim:true,
        minlength:[3,'Too short'],
        maxlength:[320,'Too long'],
        required:true,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    description:{
        type:{},
        minlength:[200,'Too short'],
        maxlength:[2000000,'Too long'],
        required:true,
    },
    price:{
        type:Number,
        default:9.99,
    },
    image: {},
    category: String,
    published:{
        type:Boolean,
        default:false,
    },
    paid:{
        type:Boolean,
        default:true,
    },
    instructor:{
        type:mongoose.ObjectId,
        ref:'User',
        required:true,
    },
    lessons:[lessonSchema],
    
},{timestamps:true},{typeKey: '$type'})

export default mongoose.model('Course',courseSchema)
