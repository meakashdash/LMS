import {useState,useEffect} from 'react'
import axios from 'axios'
// import {Context} from '../../context'
import {useRouter} from 'next/router'
import {SyncOutlined} from '@ant-design/icons'
import InstructorNav from '../nav/InstructorNav'

const InstructorRoute=({children})=>{
    //written for checking the user is present or not and that way to give output
    const [ok,setOk]=useState(false)

    //get user from the context
    // const {state:{user},}=useContext(Context)

    const router=useRouter();

    useEffect(()=>{
        const fetchInstructor=async()=>{
            try {
                const {data}=await axios.get('/api/current-instructor')
                if(data.ok) setOk(true)
            } catch (error) {
                console.log(error)
                setOk(false)
                router.push('/')
            }
        }
        fetchInstructor();
    },[])

    return (
       <>
        {!ok ? (<SyncOutlined spin className="d-flex justify-content-center display-1 text-primary p-5" />):
        (<div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'>
                    <InstructorNav />
                </div>
                <div className='col-md-10'>
                    {children}
                </div>
            </div>
        </div>)}
       </>
    )
}

export default InstructorRoute