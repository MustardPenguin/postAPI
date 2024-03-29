import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react';

import Navigation from './routes/navigation';
import CreatePost from "./routes/create-post";
import Posts from './routes/posts';
import Post from './routes/post';
import Signup from './routes/sign-up';
import Signin from './routes/sign-in';

const RouteSwitch = () => {
  const [user, setUser] = useState("");

  const updateUser = (user) => {
    setUser(user);
  }

  const getAccount = async () => {
    await fetch("http://localhost:5000/auth/verify", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    }).then(response => {
      response.json().then(data => {
        console.log(data);
        if(data.isLoggedIn === false) {
          // If token exist in local storage but logged in is false, then token
          // expired, so remove it
          localStorage.removeItem('token');
        } else if(data.user !== undefined && data.user !== null) {
          setUser(data.user.username);
        }
      })
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => { // Prevents multiple rerendering, so less API calls
    getAccount(); 
  }, []);

  return (
    <BrowserRouter>
    
    <Navigation user={{username: user, updateUser: updateUser}} />
    
    <Routes>
      <Route exact path='/posts' element={<Posts user={user}/>} />
      <Route exact path='/posts/:id' element={<Post user={user} />} />
      <Route exact path='/sign-up' element={<Signup />} />
      <Route exact path='/sign-in' element={<Signin />} />
      <Route exact path='/create-post' element={<CreatePost user={user} />} />
      
    </Routes>
      
    </BrowserRouter>
  )
}

export default RouteSwitch;
