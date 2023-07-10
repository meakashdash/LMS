import {useContext,useEffect} from 'react'
import {Context} from '../../context'
import {SynchOutlined} from '@ant-design/icons'
import UserRoute from '../../components/routes/UserRoute'
import axios from 'axios'

const StripeCallback=()=>{
    const {state:{user},dispatch}=useContext(Context)

    //when the user login immidiately check if the user has completed the stripe onboarding
    //if yes then redirect to instructor page
    useEffect(()=>{
        if(user){
            axios.post('/api/get-account-status').then(res=>{
                dispatch({
                    type:'LOGIN',
                    payload:res.data,
                })
                window.localStorage.setItem('user',JSON.stringify(res.data))
                window.location.href='/instructor'
            })
        }
    },[user])

    return (
        <SynchOutlined spin className='d-flex justify-content-center display-1 text-danger p-5' />
    )
}

export default StripeCallback