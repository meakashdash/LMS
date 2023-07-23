import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import SingleCourseView from '../../components/cards/SingleCourseView';
import PreviewModal from '../../components/modal/PreviewModal';

const SingleCourse = ({ course }) => {

  //for video preview and shwoing
  const [preview,setPreview]=useState("");
  const [visible,setVisible]=useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Use the course data to render the page content
  return (
    <>
        {isClient && <>
        <time datetime="2016-10-25" suppressHydrationWarning={true} />
        <SingleCourseView course={course} preview={preview} visible={visible} setVisible={setVisible} setPreview={setPreview}/>
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
