import {useState,useEffect} from 'react';
import axios from 'axios';
import { useRouter } from "next/router";


const SingleCourse = () => {
  const [loading,setLoading]=useState(false);
  const [courses,setCourses]=useState({lessons:[]});
  const router = useRouter();
  const {slug}=router.query;
  useEffect(()=>{
    if(slug) loadCourse();
  },[slug])

  const loadCourse=async()=>{
    try {
        setLoading(true);
        const {data}=await axios.get(`/api/user/course/${slug}`);
        console.log(data);
        setCourses(data);
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
  }

  return (
    <>
      <StudentRoute>{JSON.stringify(courses,null,4)}</StudentRoute>
    </>
  );
};

export default SingleCourse;