import React, { useState } from "react";
import InputComponent from "../../commonComponents/Input";
import Button from "../../commonComponents/Button";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleLogin = async () => {
        console.log("Handling Login")
        setLoading(true)
        if (email && password) {
            try {
                const userCredentials = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password,
                );

                const user = userCredentials.user;
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userData = userDoc.data();
                console.log("userData", userData);
                dispatch(
                    setUser({
                        name: userData.name,
                        email: user.email,
                        uid: user.uid,
                    })
                )
                toast.success("Logged in Successfully")
                setLoading(false);
                navigate("/profile");
            } catch (error) {
                console.error("Error signing up:", error.code, error.message);
                toast.error("Check your credentials or create an account")
                setLoading(false);
            }
        }
        else {
            toast.error("email and password cannot be empty")
        }
    }
    const handleForget = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                 toast.success("Password reset email sent!")
                 setLoading(false)
                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
            });
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