import {useState,useEffect,useContext} from 'react'
import axios from 'axios'
import {Context} from '../../context'
import UserRoute from '../../components/routes/UserRoute'

const UserIndex=()=>{
    //written for checking the user is present or not and that way to give output
    // const [hidden,setHidden]=useState(true)

    //get user from the context
    const {state:{user},}=useContext(Context)

    // useEffect(()=>{
    //     const fetchUser=async()=>{
    //         try {
    //             const {data}=await axios.get('/api/current-user')
    //             console.log(data)
    //             setHidden(false)
    //         } catch (error) {
    //             console.log(error)
    //             setHidden(true)
    //         }
    //     }
    //     fetchUser();
    // },[])

    return (
       <UserRoute>
        <h1 className='jumbotron text-center square'>
            {/* <pre>{JSON.stringify(user)}</pre> */}
            <h2>User Dashboard</h2>
        </h1>
       </UserRoute>
    )
}

export default UserIndex