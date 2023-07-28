import { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import SingleCourseView from '../../components/cards/SingleCourseView';
import PreviewModal from '../../components/modal/PreviewModal';
import {Context} from '../../context';
import {toast} from 'react-toastify';
import {loadStripe} from '@stripe/stripe-js';

const SingleCourse = ({ course }) => {




  const {state:{user}}=useContext(Context);
  

  //for video preview and shwoing
  const [preview,setPreview]=useState("");
  const [visible,setVisible]=useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false);
  //for the enrolled course
  const [enrolled,setEnrolled]=useState({});
 
  useEffect(() => {
    if(user && course){
      checkEnrollent();
    }
    setIsClient(true)
  }, [user,course])


  const checkEnrollent=async()=>{
    const {data}=await axios.get(`/api/check-enrollment/${course._id}`);
    setEnrolled(data);
  }


  const handlePaidEnrollment=async()=>{
    try {
      if(!user) router.push("/login");
      if(enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true);
      const {data}=await axios.post(`/api/paid-enrollment/${course._id}`);
      const stripe=await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({sessionId:data});
    } catch (error) {
        console.log(error);
        toast.error("Enrollment failed");
        setLoading(false);
    }
  }

  const handleFreeEnrollment=async(e)=>{
    e.preventDefault();
    try {
      if(!user) router.push("/login");
      if(enrolled.status) return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true);
      const {data}=await axios.post(`/api/free-enrollment/${course._id}`);
      toast.success(data.message);
      setLoading(false);
      router.push(`/user/course/${data.course.slug}`);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Enrollment failed");
    }
  }



  // Use the course data to render the page content
  return (
    <>
        {isClient && <>
        <time datetime="2016-10-25" suppressHydrationWarning={true} />
        <SingleCourseView 
          course={course} 
          preview={preview} 
          visible={visible} 
          setVisible={setVisible} 
          setPreview={setPreview}
          user={user}
          handlePaidEnrollment={handlePaidEnrollment}
          handleFreeEnrollment={handleFreeEnrollment}
          loading={loading}
          enrolled={enrolled}
          setEnrolled={setEnrolled}
        />
        <PreviewModal preview={preview} visible={visible} setVisible={setVisible}/>    
          
    </>}   
    </>
  );
};

export const getServerSideProps = async ({ query }) => {
  const { slug } = query;
  const { data } = await axios.get(`${process.env.API}/course/${slug}`);
  return {
    props: {
      course: data,
    },
  };
};

export default SingleCourse;
