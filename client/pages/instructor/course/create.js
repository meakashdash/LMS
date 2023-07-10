import axios from 'axios'
import {useState,useEffect} from 'react'
import InstructorRoute from '../../../components/routes/InstructorRoute'

const CreateCourse=()=>{
    //set all the default values
    const [values,setValues]=useState({
        name:'',
        description:'',
        price:'9.99',
        uploading:false,
        paid:true,
        loading:false,
        imagePreview:''
    })
    //using spread operator to get the values
    const handleChange=(e)=>{
        setValues({...values,[e.target.name]:e.target.value})
    }

    const handleImage=()=>{

    }


    const handleSubmit=(e)=>{
        e.preventDefault()
        console.log(values)
    }

    const createCourseForm=()=>(
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <input 
                    type='text'
                    name='name'
                    className='form-control'
                    placeholder='Name'
                    onChange={handleChange}
                    value={values.name} 
                />
            </div>
            <div className='form-group pt-3'>
                <textarea
                    name='description'
                    cols='7'
                    rows='7'
                    className='form-control'
                    placeholder='Description'
                    onChange={handleChange}
                    value={values.description} 
                ></textarea> 
            </div>
        </form>
    )
    return(
        <InstructorRoute>
            <h1 className='jumbotron text-center square'>Create Course</h1>
            <div className='pt-3 pb-3'>
                {createCourseForm()}
            </div>
        </InstructorRoute>
    )
}

export default CreateCourse