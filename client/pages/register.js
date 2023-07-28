import { useState,useEffect,useContext } from "react";
import axios from "axios";
import {toast} from 'react-toastify'
import {SyncOutlined} from '@ant-design/icons'
import Link from 'next/link'
import {Context} from '../context'
import {useRouter} from 'next/router'

const register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading]=useState(false)

  //create the context to access the state and dispatch
  const {state,dispatch}=useContext(Context)
  const {user}=state

  //create the router
  const router = useRouter()

  //to prevent user from accessing the register page again
  useEffect(()=>{
    if(user!==null){
      router.push('/')
    }
  },[user])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({name,email,password})
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/register`, {
      name,
      email,
      password,
    });
    toast.success("Registered Successfully, Please Login")
    setLoading(false);
    } catch (error) {
      toast.error(error.response.data)
      setLoading(false);
    }
  };
  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Register</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control col-4 mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            required
          />

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
            <button type="submit" className="btn btn-block btn-primary" disabled={!name || !email || !password || loading}>
              {loading?<SyncOutlined spin/>:"Submit"}
            </button>
            <p className='text-center p-3'>
              Already Registred?{" "}
              <Link href='/login' legacyBehavior>
                <a>Login</a>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default register;
