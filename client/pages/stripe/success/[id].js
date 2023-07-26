import {useEffect} from 'react';
import {SyncOutlined} from '@ant-design/icons';
import UserRoute from '../../../components/routes/UserRoute';
import {useRouter} from 'next/router';
import axios from 'axios';

const StripeSuccess=()=>{
    const router=useRouter();
    const {id}=router.query;

    useEffect(()=>{
        if(id) successRequest();
    })

    const successRequest=async()=>{
        const {data}=await axios.get(`/api/stripe-success/${id}`);
        router.push(`/user/course/${data.course.slug}`);
    }

    return(
        <UserRoute showNav={false}>
            <div className="container text-center">
                <div className="col-md-9">
                    <SyncOutlined spin className="display-1 text-danger p-5"/>
                    <p className="lead">Congratulations! Payment Successful.</p>
                </div>
                <div className='col-md-3'>

                </div>
            </div>
        </UserRoute>
    )
}

export default StripeSuccess;