import React, { useState } from "react";
import InputComponent from "../../commonComponents/Input";
import Button from "../../commonComponents/Button";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FileInput from "../../commonComponents/Input/FileInput";
import api from "../../../api/axios";

const SignupForm = () => {
    const [fullName , setFullName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [profilePic,setProfilePic] = useState(null);
    const [loading , setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profilePicHandle = (file) => {
        setProfilePic(file);
    }
    const handleSubmit = async () => {
        // Handling the submit
        setLoading(true);
        if (password === confirmPassword && password.length >= 6 && fullName && email && profilePic) {
            try {
                const formData = new FormData();
                formData.append('fullName', fullName);
                formData.append('email', email);
                formData.append('password', password);
                if (profilePic) {
                    formData.append('profilePic', profilePic);
                }

                const response = await api.post('/auth/signup', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // Save token to local storage
                localStorage.setItem('token', response.data.token);
                
                // Fetch user data
                const userRes = await api.get('/auth/me');
                const userData = userRes.data;

                //Save data in redux action
                dispatch(setUser({
                    name: userData.name,
                    email: userData.email,
                    uid: userData._id,
                    profilePic: userData.profilePic
                }));
                
                toast.success("Signed up successfully");
                setLoading(false);
                navigate("/profile");
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Signup failed");
                setLoading(false);
            }
        } else {
            if(password!=confirmPassword){
                toast.error("Please check your password and confirm password")
            }
            else if(password.length<6){
                toast.error("Password length should be minimum 6 char");
            }
            else{
                toast.error("Please fill all the fields!!")
            }
            setLoading(false);
        }
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("")
        setProfilePic(null)
    };
    
    return(
        
        <>
                <InputComponent
                state={fullName} 
                setState = {setFullName} 
                placeholder="Enter Your Name" 
                type="text"
                required={true}
                />
                <InputComponent 
                state={email} 
                setState = {setEmail} 
                placeholder="sanadams@email.com" 
                type="text"
                required={true}

                />
                <InputComponent 
                state={password} 
                setState = {setPassword} 
                placeholder="Password" 
                type="password"
                required={true}

                />
                <InputComponent 
                state={confirmPassword} 
                setState = {setConfirmPassword} 
                placeholder="Confirm Password" 
                type="password"
                required={true}
                />
                <FileInput
                accept={"image/*"}
                id="profile-image-input"
                text="Upload Profile Picture"
                fileHandle={profilePicHandle}
            />
                <Button 
                text={loading ? "Loading..." : "Sign me up!!"} 
                disabled = {loading} 
                onClick={handleSubmit} 
                
                />
        </>
    )
}
export default SignupForm;