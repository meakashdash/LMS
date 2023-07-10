import { useState,useContext,useEffect } from "react";
import axios from "axios";
import {toast} from 'react-toastify'
import {SyncOutlined} from '@ant-design/icons'
import Link from 'next/link'
import {Context} from '../context'
import {useRouter} from 'next/router'

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading]=useState(false)

  //create the context to access the state and dispatch
  const {state,dispatch}=useContext(Context)
  const {user}=state

  //create the router
  const router = useRouter()

  //to prevent user from accessing the login page again
  useEffect(()=>{
    if(user!==null){
      router.push('/')
    }
  },[user])
  // console.log("STATE",state)

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({name,email,password})
    try {
      // setLoading(true);
      const { data } = await axios.post(`/api/login`, {
      email,
      password,
    });
    // console.log("LOGIN RESPONSE", data);
    dispatch({
      type:"LOGIN",
      payload:data,
    })
    //save in local storage
    window.localStorage.setItem('user',JSON.stringify(data));
    router.push("/user")
    // setLoading(false);
    } catch (error) {
      toast.error(error.response.data)
      setLoading(false);
    }
  };
  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Login</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          
          <input
            type="email"
            className="form-control col-4 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your mailID"
            required
          />

          <input
            type="password"
            className="form-control col-4 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
            required
          />

          <br />
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-block btn-primary" disabled={!email || !password || loading}>
              {loading?<SyncOutlined spin/>:"Submit"}
            </button>
            <p className='text-center pt-3'>
              Not Yet Registred?{" "}
              <Link href='/register' legacyBehavior>
                <a>Register</a>
              </Link>
            </p>

            <p className='text-center'>
              <Link href='/forgot-password' legacyBehavior>
                <a className='text-danger'>Forgot Password</a>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default login;
