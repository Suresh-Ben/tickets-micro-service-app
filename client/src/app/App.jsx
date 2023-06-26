import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path='/' element={< Home />}></Route>
          <Route path='/signin' element={< SignIn />}></Route>
          <Route path='/signup' element={< SignUp />}></Route>

          {/* Not found */}
          <Route path='/404' element={< NotFound />} />
          <Route path='*' element={ <Navigate to="/404" /> } />
        </Routes>
    </Router>
  );
}

export default App;
