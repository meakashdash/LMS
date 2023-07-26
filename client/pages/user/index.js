import {useState,useEffect,useContext} from 'react'
import axios from 'axios'
import {Context} from '../../context'
import UserRoute from '../../components/routes/UserRoute'
import { SyncOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import { useRouter } from 'next/router';

const UserIndex=()=>{
    //written for checking the user is present or not and that way to give output
    // const [hidden,setHidden]=useState(true)

    //get user from the context
    const {state:{user},}=useContext(Context)
    const [courses,setCourses]=useState([])
    const [loading,setLoading]=useState(false);

    useEffect(()=>{
        loadCourse();
    },[])

    const router=useRouter();

    const loadCourse=async()=>{
        try {
            setLoading(true);
            const {data}=await axios.get(`/api/user-courses`);
            setCourses(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handlePlay=async(slug)=>{
        try {
          router.push(`/user/course/${slug}`);
        } catch (error) {
          console.log(error);
        }
    }



    return (
       <UserRoute>
        {loading ? (<SyncOutlined spin className="display-1 text-danger p-5"/>):
               (
                <div>
                    <h1 className='jumbotron text-center square'>
                 <h2>User Dashboard</h2>
               </h1>
               <div style={{ padding: '20px' }}>
               <Row gutter={[16, 16]}>
                 {courses.map((course) => (
                   <Col key={course._id} xs={24} sm={12} md={8} lg={6}>
                     <div
                       style={{
                         border: '1px solid #e8e8e8',
                         borderRadius: '8px',
                         padding: '16px',
                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                         backgroundColor: '#fff',
                       }}
                     >
                       <img
                         alt={course.name}
                         src={course.image.Location}
                         style={{
                           width: '100%',
                           height: '150px',
                           objectFit: 'cover',
                           borderRadius: '4px',
                         }}
                       />
                       <a href={`/user/course/${course.slug}`}
                         style={{
                           fontSize: '18px',
                           marginTop: '10px',
                           marginBottom: '5px',
                           textDecoration: 'none',
                         }}
                       >
                         {course.name}
                       </a>
                       <p
                         style={{
                           fontSize: '14px',
                           color: '#555',
                         }}
                       >
                         {course.description}
                       </p>
                       <p
                         style={{
                           fontSize: '14px',
                           marginTop: '5px',
                           color: '#888',
                         }}
                       >
                         <strong>Instructor:</strong> {course.instructor.name}
                       </p>
                       <p
                         style={{
                           fontSize: '14px',
                           marginTop: '5px',
                           color: '#888',
                         }}
                       >
                         <strong>Total Lessons:</strong> {course.lessons.length}
                       </p>
                       <div
                         style={{
                           textAlign: 'center',
                           marginTop: '10px',
                         }}
                       >
                         <PlayCircleOutlined onClick={()=>handlePlay(course.slug)} className='h2 pointer text-danger' style={{ fontSize: '24px' }} />
                       </div>
                     </div>
                   </Col>
                 ))}
               </Row>
             </div>
                </div>
               )
        }
        
        
       </UserRoute>
    )
}

export default UserIndex