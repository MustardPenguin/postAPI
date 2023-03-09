import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navigation from './routes/navigation';
import Blogs from './routes/blogs';
import Signup from './routes/sign-up';

const RouteSwitch = () => {
  return (
    <BrowserRouter>
    
    <Navigation />
    
    <Routes>
      <Route path='/blogs' element={<Blogs />} />
      <Route path='/sign-up' element={<Signup />} />
    </Routes>
      
    </BrowserRouter>
  )
}

export default RouteSwitch;
