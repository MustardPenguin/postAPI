import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navigation from './routes/navigation';
import Blogs from './routes/blogs';
import Signup from './routes/sign-up';
import Signin from './routes/sign-in';

const RouteSwitch = () => {
  return (
    <BrowserRouter>
    
    <Navigation />
    
    <Routes>
      <Route path='/blogs' element={<Blogs />} />
      <Route path='/sign-up' element={<Signup />} />
      <Route path='/sign-in' element={<Signin />} />
    </Routes>
      
    </BrowserRouter>
  )
}

export default RouteSwitch;
