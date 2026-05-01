import React, { useState } from "react";
import InputComponent from "../../commonComponents/Input";
import Button from "../../commonComponents/Button";
import api from "../../../api/axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    
    const handleLogin = async () => {
        setLoading(true)
        if (email && password) {
            try {
                const response = await api.post('/auth/login', { email, password });
                
                // Save token to local storage
                localStorage.setItem('token', response.data.token);
                
                // Fetch user data
                const userRes = await api.get('/auth/me');
                const userData = userRes.data;

                dispatch(
                    setUser({
                        name: userData.name,
                        email: userData.email,
                        uid: userData._id,
                        profilePic: userData.profilePic
                    })
                )
                toast.success("Logged in Successfully")
                setLoading(false);
                navigate("/profile");
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Invalid Credentials")
                setLoading(false);
            }
        }
        else {
            toast.error("email and password cannot be empty")
            setLoading(false);
        }
    }
    
    const handleForget = () => {
        toast.info("Password recovery is not implemented in this backend yet.");
    }
    return (

        <>
            <InputComponent
                state={email}
                setState={setEmail}
                placeholder="sanadams@email.com"
                type="text"
                required={true}

            />
            <InputComponent
                state={password}
                setState={setPassword}
                placeholder="Password"
                type="password"
                required={true}

            />
            <Button text={loading ? "Loading..." : "Login"} onClick={handleLogin} disabled={loading} />
            <p onClick={handleForget}>Forgot Password</p>
        </>
    )
}
export default LoginForm;