import {useState,useEffect} from 'react';
import {useRouter} from 'next/router';
import axios from 'axios';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import {Avatar,Tooltip,Row, Col, Card,Button,Modal,List} from 'antd'
import { CheckOutlined,EditOutlined,PlusOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import {toast} from 'react-toastify';

const {Item}=List;

const CourseView=()=>{
    const[course,setCourse]=useState({});
    //for the modal
    const[visible,setVisible]=useState(false);
    //hook to contain the lesson to be uploaded
    const[values,setValues]=useState({
        title:"",
        content:"",
        video:{},
    });
    //for loading value
    const[uploading,setUploading]=useState(false);
    //for seeing the video name
    const [uploadButtonText,setUploadButtonText]=useState('Upload Video');
    //to track the progress of uploading the video
    const [progress,setProgress]=useState(0);

    const router=useRouter();
    const {slug}=router.query;

    //always load the course when the slug changes
    useEffect(()=>{
        loadCourse();
    },[slug])

    const loadCourse=async()=>{
        //we have to destruct the data from the response
        const {data}=await axios.get(`/api/course/${slug}`);
        setCourse(data);
        // console.log(data);
    }

    //function to add lesson
    const handleAddLesson=async(e)=>{
        e.preventDefault();
        try {
            const {data}=await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`,values);
            console.log(data);
            setValues({...values,title:"",content:"",video:{}});
            setUploadButtonText('Upload Video');	
            setVisible(false);
            setCourse(data);
            toast.success('Lesson added');
        } catch (error) {
            console.log(error);
            toast.error('Lesson creation failed');
        }
    }

    //for video upload 
    const handleVideo=async(e)=>{
        try {
            const file=e.target.files[0];
            setUploadButtonText(file.name);
            setUploading(true);
            //as the video file is large so we have to store it in 
            //the form data and then send it to the backend
            const videoData=new FormData();
            videoData.append('video',file);

            //now we have to send the video to the backend
            const {data}=await axios.post(`/api/course/upload-video/${course.instructor._id}`,videoData,{
                onUploadProgress:(e)=>{
                    setProgress(Math.round((100*e.loaded)/e.total));
                }
            })
            console.log(data);
            setValues({...values,video:data});
            setUploading(false);
        } catch (error) {
            console.log(error);
            setUploading(false);
            toast.error('Video upload failed');
        }

    }

    

    //for video removal
    const handleRemoveVideo=async()=>{
        try {
            // console.log(values);
            setUploading(true);
            const {data}=axios.post(`/api/course/remove-video/${course.instructor._id}`,values.video);
            setValues({...values,video:{}});
            setUploadButtonText('Upload Video');
            setUploading(false);
        } catch (error) {
            console.log(error);
            setUploading(false);
            toast.error('Video removal failed');
        }
    }

    return(
        <InstructorRoute>
            <div className='container-fluid pt-3'>
                {/* <pre>{JSON.stringify(course,null,4)}</pre> */}
                {course && (
                    <div className='container mt-4'>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={24} md={12} lg={8}>
                                <Card cover={<img src={course.image ? course.image.Location : '/download.png'} alt='Course' />}>
                                    <Card.Meta title={course.name} description={course.category} />
                                    <p className='mt-2'>{course.lessons && course.lessons.length} Lessons</p>
                                    <div className='d-flex justify-content-between'>
                                        <Tooltip title='Edit'>
                                            <EditOutlined className='h5 text-warning' />
                                        </Tooltip>
                                        <Tooltip title='Publish'>
                                            <CheckOutlined className='h5 text-danger' />
                                        </Tooltip>
                                    </div>
                                </Card>
                                <Button onClick={()=>setVisible(true)} type='primary' className='mt-4' block>
                                    <PlusOutlined /> Add Lesson
                                </Button>
                                <Modal 
                                    title='Add new lesson'
                                    centered
                                    open={visible}
                                    onCancel={()=>setVisible(false)}
                                    footer={null}
                                >
                                    <AddLessonForm 
                                    values={values} 
                                    setValues={setValues} 
                                    handleAddLesson={handleAddLesson} 
                                    uploading={uploading}
                                    uploadButtonText={uploadButtonText}
                                    handleVideo={handleVideo}
                                    progress={progress}
                                    handleRemoveVideo={handleRemoveVideo}
                                    />
                                </Modal>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={16}>
                            <h2>{course.name}</h2>
                            <hr />
                            {/* Markdown 'source' is changed to children */}
                            <div><ReactMarkdown children={course.description} /></div>
                            <h2>Course Outline</h2>
                            
                            <hr />
                            <h4>{course && course.lessons && course.lessons.length} Lessons</h4>
                            <List itemLayout='horizontal' dataSource={course && course.lessons} renderItem={(item,index)=>(
                                <Item>
                                    <Item.Meta
                                     avatar={<Avatar>{index+1}</Avatar>}
                                     title={item.title}
                                    >
                                    </Item.Meta>
                                </Item>
                            )}>

                            </List>
                            </Col>
                        </Row>
                    </div>
                )}
            </div>
        </InstructorRoute>
    )

}

export default CourseView;