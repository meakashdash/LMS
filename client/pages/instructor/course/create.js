import axios from 'axios'
import {useState,useEffect} from 'react'
import InstructorRoute from '../../../components/routes/InstructorRoute'
import CourseCreateForm from '../../../components/forms/CourseCreateForm'
import Resizer from 'react-image-file-resizer'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'



const CreateCourse=()=>{
    //set all the default values
    const [values,setValues]=useState({
        name:'',
        description:'',
        price:'9.99',
        uploading:false,
        category:'',
        paid:true,
        loading:false,
    })
    //initialize the router
    const router=useRouter();
    //hooks to store the image
    const [image,setImage]=useState({})
    const [preview,setPreview]=useState('')
    //Manage the image text after uploading
    const [uploadButtonText,setUploadButtonText]=useState('Upload Image')

    //using spread operator to get the values
    const handleChange=(e)=>{
        setValues({...values,[e.target.name]:e.target.value})
    }

    const handleImageRemove=async()=>{
        try {
            setValues({...values,loading:true})
            const res=await axios.post('/api/course/remove-image',{image})
            setImage({})
            setPreview('')
            setUploadButtonText('Upload Image')
            setValues({...values,loading:false})
        } catch (error) {
            console.log(error)
            toast.error('Image upload failed. Try later')
            setValues({...values,loading:false})
        }
    }

    const handleImage=(e)=>{
        //grab the file
        let file=e.target.files[0]
        //set the preview by creating a object
        setPreview(window.URL.createObjectURL(file))
        //set the image name
        setUploadButtonText(file.name)
        //set loading to true
        setValues({...values,loading:true})

        //Resize the file (file,ht,width,format,quality,rotation,base64,return type)
        //In the callback we get the uri of image
        Resizer.imageFileResizer(file,720,500,'JPEG',100,0,async(uri)=>{
            try {
                //send request to the backend to upload the image in s3 bucket
                let data = await axios.post('/api/course/upload-image',{
                    image:uri,
                })
                //lets  see the data
                setImage(data.data)
                //set loading to false
                setValues({...values,loading:false})
            } catch (error) {
                console.log(error)
                //set loading to false
                setValues({...values,loading:false}) 
                toast.error('Image upload failed. Try later')
            }
        })
    }


    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const data=await axios.post('/api/course',{...values,image})
            toast.success("Congratulation. Your course is now live")
            router.push('/instructor')
        } catch (error) {
            console.log(error)
        }
    }


    return(
        <InstructorRoute>
            <h1 className='jumbotron text-center square'>Create Course</h1>
            <div className='pt-3 pb-3'>
                <CourseCreateForm
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    handleImage={handleImage}
                    values={values}
                    setValues={setValues}
                    preview={preview}
                    uploadButtonText={uploadButtonText}
                    handleImageRemove={handleImageRemove}
                />
            </div>
        </InstructorRoute>
    )
}

export default CreateCourse