import {useState,useEffect,useContext} from 'react'
import {Menu} from "antd"
import Link from "next/link"
import {AppstoreOutlined,LoginOutlined,UserAddOutlined,LogoutOutlined,CoffeeOutlined,CarryOutOutlined,TeamOutlined} from '@ant-design/icons'
import {Context} from '../context'
import {useRouter} from 'next/router'
import axios from 'axios'
import {toast} from 'react-toastify'


const {Item,SubMenu,ItemGroup}=Menu;
const TopNav = () => {
    const[current,setCurrent]=useState("")
    
    //to create the active link
    useEffect(()=>{
        process.browser && setCurrent(window.location.pathname)
    },[process.browser && window.location.pathname])

    const {state,dispatch}=useContext(Context)
    //get the user from the state
    const {user}=state
    const router=useRouter()

    const logout=async()=>{
        dispatch({
            type:"LOGOUT",
        })
        window.localStorage.removeItem('user')
        const {data}=await axios.get('/api/logout')
        toast.success(data.message)
        router.push('/login')
    }

  return (
    <Menu mode='horizontal' selectedKeys={[current]} className='mb-2'>
         <Item key="/" onClick={(e)=>setCurrent(e.key)} icon={<AppstoreOutlined />}>
            <Link legacyBehavior href="/">
                <a>App</a>
            </Link>
         </Item>

         {user && user.role && user.role.includes("Instructor")?(
            <Item key="/instructor/course/create" onClick={(e)=>setCurrent(e.key)} icon={<CarryOutOutlined />}>
                <Link legacyBehavior href="/instructor/course/create">
                    <a>Create Course</a>
                </Link>
            </Item>
         ):(
            <Item key="/user/become-instructor" onClick={(e)=>setCurrent(e.key)} icon={<TeamOutlined />}>
                <Link legacyBehavior href="/user/become-instructor">
                    <a>Become Instructor</a>
                </Link>
            </Item>
         )}


        {user && user.role && user.role.includes("Instructor") && (
            <Item key="/instructor" onClick={(e)=>setCurrent(e.key)} icon={<TeamOutlined />}>
                <Link legacyBehavior href="/instructor">
                    <a>Instructor</a>
                </Link>
            </Item>
        )}




        {user===null && (
            <>
                <Item key="/login" onClick={(e)=>setCurrent(e.key)} icon={<LoginOutlined />}>
                    <Link legacyBehavior href="/login">
                        <a>Login</a>
                    </Link>
                </Item>
                <Item key="/register" onClick={(e)=>setCurrent(e.key)} icon={<UserAddOutlined />}>
                    <Link legacyBehavior href="/register">
                        <a>Register</a>
                    </Link>
                </Item>
            </>
        )}
        
        {user!==null &&(
            <SubMenu icon={<CoffeeOutlined />} title={user?.name} className="float-right">
                <ItemGroup>
                    <Item key='/user'>
                        <Link legacyBehavior href='/user'>
                            <a>Dashboard</a>
                        </Link>
                    </Item>
                    <Item onClick={logout} className="float-right">
                        Log out
                    </Item>
                </ItemGroup>
                
            </SubMenu>
        )}
    </Menu>
  )
}

export default TopNav