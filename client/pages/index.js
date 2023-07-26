import {useState,useEffect} from 'react'
import axios from 'axios'
import CourseCard from '../components/cards/CourseCard'

const Index = ({courses}) => {

  //we comment it because the react is not seo freindly because when the useEffect loads then it require some miliseconds
  //to get the details so the seo can't find it and it will not be seo freindly

  
  // const [courses,setCourses]=useState([]);

  // useEffect(()=>{
  //   const fetchCourse=async()=>{
  //     const {data}=await axios.get('/api/courses');
  //     setCourses(data);
  //   }
  //   fetchCourse();
  // },[])

  if(!courses) return <h1 className='text-danger'>No Courses Found</h1>

  return (
    <>
        <h1 className='jumbotron text-center bg-primary square'>Online Education Marketplace</h1>
        <div className='container-fluid'>
          <div className='row'> 
            <CourseCard courses={courses} />
          </div>
        </div>
    </>
  )
}

export const getServerSideProps=async()=>{
  const {data}=await axios.get(`${process.env.API}/courses`);
  if(data){
    return{
      props:{
        courses:data,
      }
    }
  }
}

export default Index