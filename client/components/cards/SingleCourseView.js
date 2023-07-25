import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Button, Card, Row, Col, Image, Typography, Space } from 'antd';
import SingleCourseLessons from './SingleCourseLessons';
import {currencyFormatter} from '../../utils/helpers'
import ReactPlayer from 'react-player'
import { LoadingOutlined, SafetyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;


const SingleCourseView=({
  course,
  preview,
  visible,
  setPreview,
  setVisible,
  user,
  handlePaidEnrollment,
  handleFreeEnrollment,
  loading,
  enrolled,
  setEnrolled})=>{
    return(
        <div style={{ margin: '40px auto', maxWidth: '1200px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            {course.lessons[0].video && course.lessons[0].video.Location?(
              <div onClick={()=>{
                  setPreview(course.lessons[0].video.Location);
                  setVisible(!visible);}
              }>
                  <ReactPlayer
                      className='react-player-div'
                      url={course.lessons[0].video.Location}
                      light={course.image.Location}
                      width={400}
                      height='200px'
                  />
              </div>
            ):<Image
            src={course.image ? course.image.Location : '/download.png'}
            alt={course.name}
            width={400}
            style={{ height: '200px', objectFit: 'cover', borderRadius: '4px' }}
          />}
            <div style={{ marginTop: '20px' }}>
              {loading?(<div className='d-flex justify-content-center'>
                  <LoadingOutlined />
              </div>):(
                <Button type="primary" icon={<SafetyOutlined />} disabled={loading} shape='round' block onClick={course.paid?handlePaidEnrollment:handleFreeEnrollment}>
                  {user?enrolled.status?"Go to Course":"Enroll":"Log in to Enroll"}
                </Button>
              )}
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <Card className="course-card" style={{ height: '100%', borderRadius: '4px' }}>
              <Title level={3}>{course.name}</Title>
              <Text strong>Price: </Text>
              <Text>{course.paid?currencyFormatter({amount:course.price,currency:'usd'}):"Free"}</Text><br />
              <Text>Last Updated: {new Date(course.updatedAt).toLocaleDateString()}</Text>
              <div style={{ marginTop: '20px' }}>
                <Title level={4}>Description:</Title>
                <Text>{course.description}</Text>
              </div>
              {/* Add more course details here if needed */}
            </Card>
          </Col>
        </Row>
        <SingleCourseLessons course={course} preview={preview} setPreview={setPreview} visible={visible} setVisible={setVisible} /> 
      </div>
    )
}

export default SingleCourseView;