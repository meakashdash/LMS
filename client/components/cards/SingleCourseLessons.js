import { PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Space, Typography} from 'antd';

const { Title } = Typography;


const SingleCourseLessons=({course,preview,setPreview,visible,setVisible})=>{
    return(
    <>
        {course.lessons && course.lessons.length > 0 && (
          <div className="lesson-list" style={{ marginTop: '40px' }}>
            <Title level={3}>Course Lessons</Title>
            <ul className="list-group">
              {course.lessons.map((lesson) => (
                <li
                  key={lesson._id}
                  className="list-group-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px',
                  }}
                >
                  <Title level={4}>{lesson.title}</Title>
                  <Space>
                    
                    {lesson.content && (
                      <Button
                        type="primary"
                        icon={<FileTextOutlined />}
                        onClick={() => console.log('Open content:', lesson.content)}
                      >
                        Open Content
                      </Button>
                    )}
                    {lesson.free_preview && (
                      <Button icon={<PlayCircleOutlined />}  onClick={()=>{setPreview(lesson.video && lesson.video.Location); setVisible(!visible);}} style={{ backgroundColor: '#52c41a', padding: '6px 12px', borderRadius: '4px' }}>
                        Free Preview
                      </Button>
                    )}
                    {lesson.video && !lesson.free_preview && (
                      <Button
                        type="danger"
                        icon={<PlayCircleOutlined />}
                        onClick={() => console.log('Play video:', lesson.video)}
                      >
                        Play Video
                      </Button>
                    )}
                  </Space>
                </li>
              ))}
            </ul>
          </div>
        )}
    </>)
}

export default SingleCourseLessons;