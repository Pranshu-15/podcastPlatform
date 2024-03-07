import React from "react";
import { useSelector } from "react-redux";
import Header from "../Component/commonComponents/Header";
import Button from "../Component/commonComponents/Button";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import Loader from "../Component/commonComponents/Loader";

const ProfilePage = () => {
    const user = useSelector((state)=> state.user.user);
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
            <div><h1>Hello {user.name}</h1></div>
            <img src={user.profilePic} alt="Profile" />

            <Button text={"LogOut"} onClick={handleLogout}/>
        </>
    )
}
export default ProfilePage;

