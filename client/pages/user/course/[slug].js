import {useState,useEffect} from 'react';
import axios from 'axios';
import { useRouter } from "next/router";
import {Menu,Avatar,Checkbox} from 'antd';
import StudentRoute from '../../../components/routes/StudentRoute';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import { PlayCircleFilled } from '@ant-design/icons';


const SingleCourse = () => {
  const [loading,setLoading]=useState(false);
  const [courses,setCourses]=useState({lessons:[]});
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons,setCompletedLessons]=useState([]); 
  const [updateState,setUpdateState]=useState(false);
  const router = useRouter();
  const {slug}=router.query;
  useEffect(()=>{
    if(slug) loadCourse();
  },[slug])

  const loadCourse=async()=>{
    try {
        setLoading(true);
        const {data}=await axios.get(`/api/user/course/${slug}`);
        setCourses(data);
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
  }

  useEffect(()=>{
    if(courses) listCompleted(); 
  },[courses])

  const listCompleted=async()=>{
    const {data}=await axios.post('/api/list-completed',{courseId:courses._id,});
    setCompletedLessons(data);
  }

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
  };

  const markCompleted=async()=>{
    const {data}=await axios.post('/api/mark-completed',{
      courseId:courses?._id,
      lessonId:selectedLesson?._id,
    })
    setCompletedLessons([...completedLessons,selectedLesson?._id]);
  }

  const markIncompleted=async()=>{
    try {
      const {data}=await axios.post('/api/mark-incompleted',{
        courseId:courses?._id,
        lessonId:selectedLesson?._id,
      })
      const all=completedLessons;
      const index=all.indexOf(selectedLesson?._id);
      if(index>-1){
        all.splice(index,1);
        setCompletedLessons(all);
      }
      setCompletedLessons(all);
      setUpdateState(!updateState);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <StudentRoute>
      <div style={{ display: 'flex', height: '100vh' }}>
          {/* Sidebar */}
          <Menu
            mode="inline"
            style={{ width: '300px' }}
            selectedKeys={selectedLesson ? [selectedLesson._id] : []}
          >
            <div className='col alert alert-primary square'>
                <b>N.B: First select the lesson</b>
            </div>
            {courses.lessons.map((lesson,index) => (
              <Menu.Item
                key={lesson._id}
                onClick={() => handleLessonSelect(lesson)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Avatar>{index + 1}</Avatar>
                    {" " + lesson.title}
                  </div>
                  {completedLessons.includes(lesson._id)?(
                    <Checkbox onChange={selectedLesson && markIncompleted} checked />
                  ):(
                    <Checkbox onChange={selectedLesson && markCompleted} />
                  )}
                </div>
              </Menu.Item>
            ))}
          </Menu>

          {/* Main Body */}
          <div style={{ flex: 1, padding: '20px' }}>
            {selectedLesson ? (
              <div>
                <div className='col alert alert-primary square'>
                  <b>{selectedLesson.title?.substring(0,30)}</b>
                </div>                
                {selectedLesson.video && selectedLesson.video.Location && (
                    <ReactPlayer
                      url={selectedLesson.video.Location}
                      className="player"
                      width="100%"
                      height="400px"
                      controls
                      onEnded={()=>markCompleted()}
                    />
                )}
                <br />
                <ReactMarkdown 
                    children={selectedLesson.content}
                    className='single-post'
                />
              </div>
            ) : (
              <div>
                <div className='d-flex justify-content-center p-5'>
                  <div className='text-center p-5'>
                    <PlayCircleFilled className='text-primary display-1 p-5'/>
                    <p className='lead'>Click on the lessons to start learning</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </StudentRoute>
    </>
  );
};

export default SingleCourse;