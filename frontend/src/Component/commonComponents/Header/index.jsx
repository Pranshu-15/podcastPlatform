import React, { useEffect, useRef } from "react";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import TemporaryDrawer from "./drawer";
import { gsap } from "gsap";

const Header = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const navRef = useRef(null);

    // Check auth purely from token — no Redux needed
    const isLoggedIn = Boolean(localStorage.getItem('token'));

    useEffect(() => {
        gsap.fromTo(navRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );
        gsap.fromTo(".links a",
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.3 }
        );
    }, []);

    return (
        <div className="navbar" ref={navRef}>
            <div className="links">
                <Link to="/podcasts" className={currentPath === '/podcasts' ? 'active' : ""}>
                    Podcasts
                </Link>
                {isLoggedIn && (
                    <Link to="/create-a-podcast" className={currentPath === "/create-a-podcast" ? 'active' : ""}>
                        Create Podcast
                    </Link>
                )}
                {isLoggedIn ? (
                    <Link to="/profile" className={currentPath === "/profile" ? 'active' : ""}>
                        Profile
                    </Link>
                ) : (
                    <Link to="/" className={currentPath === '/' ? 'active' : ""}>
                        Sign Up
                    </Link>
                )}
            </div>
            <div className="mobile-drawer"><TemporaryDrawer /></div>
        </div>
    );
};

export default Header;