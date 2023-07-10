import {useState,useContext,useEffect} from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import {SyncOutlined} from '@ant-design/icons'
import Link from 'next/link'
import {Context} from '../context'
import {useRouter} from 'next/router'

const ForgotPassword=()=>{
    const [email,setEmail]=useState('')
    const [success,setSuccess]=useState(false)
    const [code,setCode]=useState('')
    const [newPassword,setNewPassword]=useState('')
    const [loading,setLoading]=useState(false)

    //lets get the user from the context
    const {state:{user}}=useContext(Context)

    //initialize the router
    const router=useRouter()
    //when the page loads if the user is present then we show them the dashboard
    useEffect(()=>{
        if(user!==null){
            router.push('/')
        }
    },[])

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            setLoading(true)
            const {data}=await axios.post('/api/forgot-password',{email})
            setSuccess(true)
            toast.success('Please check your mail to get the code')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data)
        }
    }

    const handleResetCode=async(e)=>{
        e.preventDefault()
        try {
            setLoading(true)
            const {data}=await axios.post('/api/reset-password',{
                email,
                code,
                newPassword
            })
            setEmail('')
            setCode('')
            setNewPassword('')
            setLoading(false)
            toast.success("Great! You can login with your new password")
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data)
        }
    }

    return(
        <>
            <h1 className="jumbotron text-center bg-primary square">Forgot Password</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={success?handleResetCode:handleSubmit}>
                <input
                    type="email"
                    className="form-control col-4 mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your mailID"
                    required
                />

                {success && <>
                    <input
                    type="text"
                    className="form-control col-4 mb-4"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter Your Reset Code"
                    required
                />
                <input
                    type="password"
                    className="form-control col-4 mb-4"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New Password"
                    required
                />
                
                </>}

                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-block btn-primary" disabled={!email || loading}>
                            {loading?<SyncOutlined spin/>:"Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ForgotPassword;