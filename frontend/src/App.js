import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUpPage from './Pages/SignUpPage';
import ProfilePage from './Pages/ProfilePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from './api/axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './slices/userSlice';
import PrivateRoutes from './Component/commonComponents/PrivateRoutes';
import CreateAPodcastPage from './Pages/CreateAPodcast';
import PodcastsPage from './Pages/Podcasts';
import PodcastDetailsPage from './Pages/PodcastDetails';
import CreateAnEpisodePage from './Pages/CreateAnEpisode';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          const userData = response.data;
          dispatch(
            setUser({
              name: userData.name,
              email: userData.email,
              uid: userData._id,
              profilePic: userData.profilePic
            })
          );
        } catch (error) {
          console.error("Error fetching user data or token expired:", error);
          localStorage.removeItem('token');
        }
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path='/' element={<SignUpPage />} />
          <Route element={<PrivateRoutes/>}>
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/create-a-podcast' element={<CreateAPodcastPage />} />
            <Route path='/podcasts' element={<PodcastsPage/>} />
            <Route path='/podcasts/podcast/:id' element={<PodcastDetailsPage />} />
            <Route path='/profile/podcast/:id' element={<PodcastDetailsPage />} />
            <Route path='/podcast/:id/create-episode' element={<CreateAnEpisodePage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
