import React, { useState } from "react";
import InputComponent from "../../commonComponents/Input";
import Button from "../../commonComponents/Button";
import {auth , db , storage} from "../../../firebase"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FileInput from "../../commonComponents/Input/FileInput";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
        console.log("Handling the submit");
        setLoading(true);
        if (password === confirmPassword && password.length >= 6 && fullName && email ) {
            try {
                const profilePicRef = ref(storage, `podcasts/${auth.currentUser.uid}/${Date.now()}`);
                await uploadBytes(profilePicRef, profilePic);
                const profilePicURL = await getDownloadURL(profilePicRef);
                console.log("profilePic", profilePicURL);
                toast.success("Profile Picture Uploaded Successfully");
                //creating users account
                const userCredentials = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                const user = userCredentials.user;
                console.log("user", user);
                //Saving Users details
                await setDoc(doc(db , "users" , user.uid) , {
                    name:fullName,
                    email:user.email,
                    uid:user.uid,
                    profilePic:profilePicURL
                    
                });
                //Save data in redux action
                dispatch(setUser({
                    name:fullName,
                    email:user.email,
                    uid:user.uid,
                    profilePic:profilePicURL
                }));
                toast.success("Logged in Successfully")
                console.log("profilePicURL:", profilePic)
                setLoading(false);
                navigate("/profile")
            } catch (error) {
                console.error(error.message);
                toast.error(error.message);
                setLoading(false);
            }
        } else {
            if(password!=confirmPassword){
                toast.error("Please check your password and confirm password")
            }
            else if(password.length<5){
                toast.error("Password length should be minimum 6 char");
            }
            setLoading(false);
        }
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("")
        setProfilePic("")
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