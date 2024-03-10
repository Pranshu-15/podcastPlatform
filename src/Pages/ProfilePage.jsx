import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Component/commonComponents/Header";
import Button from "../Component/commonComponents/Button";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import Loader from "../Component/commonComponents/Loader";
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { setUser } from "../slices/userSlice";
import PodcastCard from "../Component/Podcasts/PodcastCard";
import { Link } from "react-router-dom";

const ProfilePage = () => {
    const user = useSelector((state)=> state.user.user);
    const [userPodcasts, setUserPodcasts] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUserData = async () => {
            const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
                if (userAuth) {
                    // Fetch user data from Firestore
                    const docRef = doc(db, "users", userAuth.uid);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        dispatch(setUser(userData));
                        
                        // Fetch podcasts created by the user
                        const userPodcastsQuery = query(collection(db, "podcasts"), where("createdBy", "==", userAuth.uid));
                        const querySnapshot = await getDocs(userPodcastsQuery);
                        const podcastsData = [];
                        querySnapshot.forEach((doc) => {
                            podcastsData.push({ id: doc.id, ...doc.data() });
                        });
                        setUserPodcasts(podcastsData);
                    } else {
                        console.log("No such user document!");
                    }
                } else {
                    // If no user is logged in, handle accordingly
                }
            });
    
            // Cleanup
            return unsubscribe;
        };

        fetchUserData();
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
        <h1>Profile</h1>
            <img className="userProfileImage" src={user.profilePic} alt="Profile" />
            <div><h1>Hello {user.name}</h1></div>
            {userPodcasts.length > 0 ?(
                    <>
                    <h2>Your Podcasts</h2>
                <div className="profile-podcast">
                {userPodcasts.map(item => (
                                <div key={item.id}>
                                    <Link to={`/podcasts/podcast/${item.id}`}>
                                        <PodcastCard
                                            key={item.id}
                                            id={item.id}
                                            title={item.title}
                                            displayImage={item.displayImage}
                                        />
                                    </Link>
                                </div>
                            ))}
                </div>
                    </>)
                    :
                    (<p>No Podcast created Yet</p>)
            }
            <Button width={"20%"} text={"LogOut"} onClick={handleLogout} />
            </div>
        </>
    )
}
export default ProfilePage;

