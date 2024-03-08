import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Component/commonComponents/Header";
import Button from "../Component/commonComponents/Button";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import Loader from "../Component/commonComponents/Loader";
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { setUser } from "../slices/userSlice";

const ProfilePage = () => {
    const user = useSelector((state)=> state.user.user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // If a user is logged in, fetch their data from Firestore
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    // If the document exists, dispatch an action to save the user data in Redux
                    const userData = docSnap.data();
                    dispatch(setUser(userData));
                } else {
                    console.log("No such document!");
                }
            } else {
                // If no user is logged in, handle accordingly
            }
        });
    
        // Cleanup
        return unsubscribe;
    }, [dispatch]);
    
    if(!user){
        return <Loader/>
    }
    const handleLogout = () => {
        signOut(auth).then(() => {
            toast.success("User Logged Out!!")
            
        }).catch((error) => {
            toast.error(error.message)
          });
    }
    return(
        <>
        <Header/>
        <div className="input-wrapper">
            <img className="userProfileImage" src={user.profilePic} alt="Profile" />
            <div><h1>Hello {user.name}</h1></div>
            <Button text={"LogOut"} onClick={handleLogout}/>
            </div>
        </>
    )
}
export default ProfilePage;

