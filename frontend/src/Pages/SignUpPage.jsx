import React, { useState, useEffect, useRef } from "react";
import SignupForm from "../Component/SignupComponents/SignupForm";
import LoginForm from "../Component/SignupComponents/LoginForm";
import { gsap } from "gsap";

const SignUpPage = () => {
    const [flag, setFlag] = useState(false);
    const wrapperRef = useRef(null);
    const titleRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        // Initial setup
        gsap.set(wrapperRef.current, { opacity: 0, scale: 0.95, y: 30 });
        gsap.set(titleRef.current, { opacity: 0, y: -20 });
        gsap.set(textRef.current, { opacity: 0, y: 20 });

        // Intro animation
        const tl = gsap.timeline();
        tl.to(wrapperRef.current, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            delay: 0.2
        })
        .to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.6")
        .to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.4");
    }, []);

    // Animate transition between Login and Signup
    useEffect(() => {
        gsap.fromTo(".form-container", 
            { opacity: 0, x: flag ? 30 : -30 }, 
            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
        );
    }, [flag]);

    return (
        <>
            <div className="ambient-blob" style={{ top: "20%", left: "10%", width: "400px", height: "400px", background: "rgba(102, 252, 241, 0.15)" }}></div>
            <div className="ambient-blob" style={{ bottom: "10%", right: "10%", width: "500px", height: "500px", background: "rgba(69, 162, 158, 0.1)" }}></div>
            
            <div className="input-wrapper glass-panel" ref={wrapperRef}>
                <h1 ref={titleRef}>{!flag ? "Join the Future" : "Welcome Back"}</h1>
                
                <div className="form-container" style={{ width: "100%" }}>
                    {!flag ? <SignupForm /> : <LoginForm />}
                </div>

                {!flag ? (
                    <p ref={textRef} onClick={() => setFlag(!flag)}>
                        Already have an Account? <span style={{ color: "var(--accent)" }}>Login here</span>.
                    </p>
                ) : (
                    <p ref={textRef} onClick={() => setFlag(!flag)}>
                        Don't have an account? <span style={{ color: "var(--accent)" }}>Signup here</span>.
                    </p>
                )}
            </div>
        </>
    );
};

export default SignUpPage;


