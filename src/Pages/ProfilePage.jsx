import React from "react";
import { useSelector } from "react-redux";
import Header from "../Component/commonComponents/Header";
import Button from "../Component/commonComponents/Button";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

const ProfilePage = () => {
    const user = useSelector((state)=> state.user.user);
    if(!user){
        return <p>Loading......</p>
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
            <Button text={"LogOut"} onClick={handleLogout}/>
        </>
    )
}
export default ProfilePage;

