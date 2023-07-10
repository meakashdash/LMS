// This is a global state where all the data are present so we can 
// access them from anywhere
import {useReducer,createContext,useEffect} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'

//create a initial state with user is null
const initialState = {
    user: null,
}


//Then create a context
const Context = createContext()



//create a reducer by which we can update and access the state
const rootReducer=(state,action)=>{
    switch(action.type) {
        case "LOGIN":
            return {...state,user:action.payload}
        case "LOGOUT":
            return {...state,user:null}
        default:
            return state
    }
}




const Provider=({children})=>{

    const router = useRouter()

    //used to set the state in the page after refresh
    useEffect(()=>{
        dispatch({
            type:"LOGIN",
            payload:JSON.parse(window.localStorage.getItem('user')),
        })
    },[])

    //This function axios.interceptors called for every request and it is used here 
    //to  remove user after the token has expired(when a response is found)
    axios.interceptors.response.use(function(response){
        //Any status code lies within the range of 2XX cause the function to trigger
        return response
    },function(error){
        //Any status code lies outside the range of 2XX cause the function to trigger
        let res=error.response
        if(res.status===401 && res.config && !res.config.__isRetryRequest){
            return new Promise((resolve,reject) =>{
                axios
                .get('/api/logout')
                .then((data)=>{
                    console.log("401 Error-->LOGOUT")
                    dispatch({type:"LOGOUT"})
                    window.localStorage.removeItem('user')
                    router.push('/login')
                })
                .catch((error)=>{
                    console.log("AXIOS INTERCEPTORS ERROR",error);
                    reject(error);
                })
            })
        }
        return Promise.reject(error)
    })


    //use dispatch function to change the state
    const [state,dispatch]=useReducer(rootReducer,initialState)

    useEffect(()=>{
        const getCsrfToken=async()=>{
            //get the token from the server
            const {data}=await axios.get('/api/csrf-token')
            //print it
            // console.log("CSRF",data)
            //paste it into the request axios header
            axios.defaults.headers["X-CSRF-Token"]=data.csrfToken;
        }
        getCsrfToken();
    },[])

    return (
        <Context.Provider value={{state,dispatch}}>
            {children}
        </Context.Provider>
    )
}

export {Context,Provider}
