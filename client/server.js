const express=require('express')
const next=require('next')
const {createProxyMiddleware} = require('http-proxy-middleware')


//check if we are in dev mode or production mode
const dev=process.env.NODE_ENV !== 'production'
const app=next({dev})
const handle=app.getRequestHandler()




app.prepare().then(()=>{
    //create a express server
    const server=express();
    //apply when we are in dev mode
    if(dev){
        //use this middleware when we hit /api call or backend call then create a proxy server on this target
        //to make it as a same origin
        server.use('/api',createProxyMiddleware({
            target:"http://localhost:8000",
            changeOrigin:true,
        }))
    }

    //when we get a request then we have to handle the request and response
    server.all('*',(req,res)=>{
        return handle(req,res)
    })

    //run the server
    server.listen(3000,(err)=>{
        if(err){
            throw err
        }
        console.log("Ready on http://localhost:3000")
    })
}).catch(err=>{
    console.log('Error:',err)
})