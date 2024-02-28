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

const SignupForm = () => {
    const [fullName , setFullName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [loading , setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleSubmit = async () => {
        console.log("Handling the submit");
        setLoading(true);
        if (password === confirmPassword && password.length >= 6 && fullName && email ) {
            try {
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
                });
                //Save data in redux action
                dispatch(setUser({
                    name:fullName,
                    email:user.email,
                    uid:user.uid,
                }));
                toast.success("Logged in Successfully")
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
    };
    return(
        
        <>
                <InputComponent
                state={fullName} 
                setState = {setFullName} 
                placeholder="San Adams" 
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
                <Button 
                text={loading ? "Loading..." : "Sign me up!!"} 
                disabled = {loading} 
                onClick={handleSubmit} 
                
                />
        </>
    )
}
export default SignupForm;