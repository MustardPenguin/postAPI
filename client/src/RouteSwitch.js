import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from 'react';

import Navigation from './routes/navigation';
import CreatePost from "./routes/create-post";
import Blogs from './routes/blogs';
import Signup from './routes/sign-up';
import Signin from './routes/sign-in';

const RouteSwitch = () => {
  const [user, setUser] = useState("");

  const updateUser = (user) => {
    console.log("Setting user " + user);
    setUser(user);
  }

  const getAccount = async () => {
    await fetch("http://localhost:5000/users", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    }).then(response => {
      response.json().then(data => {
        if(data.user !== null) {
          setUser(data.user.username);
        }
      })
    }).catch(err => {
      console.log(err);
    });
  }

  getAccount();

  return (
    <BrowserRouter>
    
    <Navigation user={{username: user, updateUser: updateUser}} />
    
    <Routes>
      <Route path='/blogs' element={<Blogs />} />
      <Route path='/sign-up' element={<Signup />} />
      <Route path='/sign-in' element={<Signin />} />
      <Route path='/create-post' element={<CreatePost />} />
    </Routes>
      
    </BrowserRouter>
  )
}

export default RouteSwitch;
