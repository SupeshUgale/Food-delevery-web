import React from 'react'
import Nbar from './Componenets/Nbar/Nbar.jsx'
import Sidebar from './Componenets/Sidebar/Sidebar.jsx'
import { Route, Routes } from 'react-router-dom'
import List from './Pages/List/List.jsx'
import Orders from './Pages/Order/Order.jsx'
import Add from './Pages/Add/Add.jsx'
import { Navigate } from "react-router-dom";
//for notification ,we have use this to get notification when our data get save in our database
import { ToastContainer, } from 'react-toastify';

const App = () => {
//as we using the url in all three pages hence we have defined it as prop in app.jsx 
// and destructure it in the add,list,ordert
 console.log("HIIIII");
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  
  return (
    <div>
    <ToastContainer/>
    <Nbar/>
    <hr/>
    <div className='app-content'>
       <Sidebar/>
       <Routes>
        {/*as have not added any route for / hence navigating to the order page for temprory */}
        <Route path="/" element={<Navigate to="/orders" />}/>
        <Route path='/add' element={<Add url={url}/>}/>
        <Route path='/list' element={<List url={url}/>}/>
        <Route path='/orders' element={<Orders url={url}/>}/>
       </Routes>
    </div>

     
    </div>
  )
}

export default App