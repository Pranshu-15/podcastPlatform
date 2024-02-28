import {BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import './App.css';
import SignUpPage from './Pages/SignUpPage';
import ProfilePage from './Pages/ProfilePage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';


const App = () => {
  useEffect(() => {
    const authUnsubscribe = () => {};
    
    return authUnsubscribe();
  },[])
  return (
    <>
    <ToastContainer />
       <Router>
          <Routes>
            <Route path='/' element = {<SignUpPage />}/>
            <Route path='/profile' element = {<ProfilePage/>}/>
          </ Routes>
        </Router >
    </>
  )
}

export default App;

