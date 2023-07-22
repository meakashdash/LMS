import {useState,useEffect} from 'react'
import axios from 'axios'
import InstructorRoute from '../../components/routes/InstructorRoute'
import {Avatar} from 'antd'
import Link from 'next/link'
import { Card } from 'antd';

const { Meta } = Card;

const InstructorIndex=()=>{

    const [course,setCourse]=useState([]);//initially it is empty array to save the course

    const loadCourse=async()=>{
        const {data}=await axios.get('/api/instructor-courses');
        setCourse(data);
    }

    useEffect(()=>{
        loadCourse();
    },[])


    return(
        <InstructorRoute>
            <h1 className='jumbotron text-center square'>Instructor Dashboard</h1>
            {/* <pre>{JSON.stringify(course,null,4)}</pre> */}
            {course && course.map((c)=>(
                <>
                    <div style={{display:'inline-flex',paddingLeft:'4px'}}>
                        <Link legacyBehavior href={`/instructor/course/view/${c.slug}`} className='pointer'>
                            <Card
                                small
                                hoverable
                                style={{ width: 240 }}
                                cover={<img alt="example" style={{ height: '200px', objectFit: 'cover' }}  src={c.image?c.image.Location:'/download.png'} />}
                            >
                                <Meta title={c.name} description={c.lessons.length+" Lessons"} />
                                <br />
                                <Meta description={c.lessons.length<5?("At least 5 lessons required to publish a course"):course.published?("Your Course Live in the Marketplace"):("Your course is ready to be published")} />

                            </Card>
                        </Link>
                    </div>
                </>
            ))}
        </InstructorRoute>
    )
}

export default InstructorIndex