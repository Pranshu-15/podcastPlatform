// import {BrowserRouter as Router,Routes,Route } from 'react-router-dom';
// import './App.css';
// import SignUpPage from './Pages/SignUpPage';
// import ProfilePage from './Pages/ProfilePage';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useEffect } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth, db } from './firebase';
// import { doc, onSnapshot } from 'firebase/firestore';
// import { useDispatch } from 'react-redux';
// import { setUser } from './slices/userSlice';


// const App = () => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged (auth,(user) => {
//       if(user){
//         const unsubscribeSnapshot = onSnapshot(
//           doc(db, "users", user.uid),
//           (userDoc) => {
//             if(userDoc.exists()) {
//               const userData = userDoc.data();
//               dispatch(
//                 setUser({
//                   name:userData.name,
//                   email:userData.email,
//                   uid:user.uid,
//                 })
//               );
//             }
//           },
//           (error) =>{
//             console.log("Error fetching user data:" , error);
//           }
//         );
//         return () => {
//           unsubscribeSnapshot();
//         };
//       };
//     });
    
//     return unsubscribeAuth();
//   },[])
//   return (
//     <>
//     <ToastContainer />
//        <Router>
//           <Routes>
//             <Route path='/' element = {<SignUpPage />}/>
//             <Route path='/profile' element = {<ProfilePage/>}/>
//           </ Routes>
//         </Router >
//     </>
//   )
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUpPage from './Pages/SignUpPage';
import ProfilePage from './Pages/ProfilePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from './slices/userSlice';
import PrivateRoutes from './Component/commonComponents/PrivateRoutes';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: user.uid,
                })
              );
            }
          },
          (error) => {
            console.log("Error fetching user data:", error);
          }
        );
        return () => {
          unsubscribeSnapshot();
        };
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path='/' element={<SignUpPage />} />
          <Route element = {<PrivateRoutes/>}>
          <Route path='/profile' element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;


