import React   from "react";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import TemporaryDrawer from "./drawer";
const Header = () => {
    const location = useLocation();
    const currentPath = location.pathname;
  
    return (
        <>
            <div className="navbar">
                <div className="gradientContainer"></div>
                <div className="links">
                    <Link to="/" className={currentPath === '/' ? 'active' : ""}>
                        SignUp
                    </Link>
                    <Link to="/podcasts" className={currentPath === '/podcasts' ? 'active' : ""}>
                        Podcasts
                    </Link>
                    <Link to="/create-a-podcast" className={currentPath === "/create-a-podcast" ? 'active' : ""}>
                        Create A Podcast
                    </Link>
                    <Link to="/profile" className={currentPath === "/profile" ? 'active' : ""}>
                        Profile
                    </Link>
                </div>
                <div className="mobile-drawer"><TemporaryDrawer/></div>
            </div>
        </>
    )
}
export default Header;