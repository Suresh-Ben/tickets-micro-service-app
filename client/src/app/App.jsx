import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Tickets from "./pages/Tickets";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path='/' element={< Home />}/>
          <Route path='/signin' element={< SignIn />}/>
          <Route path='/signup' element={< SignUp />}/>
          <Route path="/tickets/*" element={< Tickets/>}/>
          <Route path="/orders" element={< Orders/>}/>
          <Route path="/payments/:orderId" element={< Payment/>}/>

          {/* Not found */}
          <Route path='/404' element={< NotFound />} />
          <Route path='*' element={ <Navigate to="/404" /> } />
        </Routes>
    </Router>
  );
}

export default App;
