import React from "react";
import { useSelector } from "react-redux";
import Header from "../Component/commonComponents/Header";

const ProfilePage = () => {
    const user = useSelector((state)=> state.user.user);
    return(
        <>
        <Header/>
            <div><h1>Hello {user.name}</h1></div>
        </>
    )
}
export default ProfilePage;