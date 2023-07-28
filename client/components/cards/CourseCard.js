import { Badge, Card, Tooltip } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { currencyFormatter } from '../../utils/helpers';

const CourseCard = ({ courses }) => {
  return (
    <>
      {courses && courses.map((course) => (
        <div key={course._id} className='col-md-4'>
          <Link legacyBehavior href={`/course/${course.slug}`}>
            <a style={{textDecoration: 'none'}}>
              <Card
                cover={
                  <img
                    src={course.image ? course.image.Location : '/download.png'}
                    alt={course.name}
                    style={{ height: '200px', objectFit: 'cover' }} 
                  />
                }
                // actions={[
                //   <Tooltip title='Edit'>
                //     <EditOutlined key='edit' className='text-warning' />
                //   </Tooltip>,
                //   <Tooltip title='Publish'>
                //     <CheckOutlined key='publish' className='text-danger' />
                //   </Tooltip>,
                // ]}
              >
                {/* <Card.Meta
                  title={course.name}
                  description={course.description}
                /> */}
                <h3 className='font-weight-bold'>{course.name}</h3>
                <h5>{course.description}</h5>
                <br />
                <p>{course.lessons && course.lessons.length} Lessons</p>
                <Badge count={course.category}  style={{ backgroundColor: "#03a9f4" }} />
                <h4 className='pt-2'>{course.paid?currencyFormatter({
                  amount:course.price,
                  currency:'usd'
                }):"Free"}</h4>
              </Card>
            </a>
          </Link>
        </div>
      ))}
    </>
  );
};

export default CourseCard;
