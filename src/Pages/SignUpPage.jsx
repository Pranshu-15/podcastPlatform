import React, { useState } from "react";
import Header from "../Component/commonComponents/Header";
import SignupForm from "../Component/SignupComponents/SignupForm";
import LoginForm from "../Component/SignupComponents/LoginForm";

const SignUpPage = () => {
    const [flag , setFlag] = useState(false);
    return (
        <>
            <Header />
            <div className="input-wrapper">
            {!flag ? <h1>SignUp</h1> : <h1>Login</h1>}
              {!flag ? <SignupForm /> : <LoginForm/>}
               {!flag ? (
                <p onClick={() => setFlag(!flag)}>
                 Already have an Account? Click here to Login.
                 </p>)
                 : 
                 (<p onClick={() => setFlag(!flag)}>
                 Don't have an account? Click here to Signup.
                 </p>
                 )}
            </div>
        </>
    );
};

export default SignUpPage;


