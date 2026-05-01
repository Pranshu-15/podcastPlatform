import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { IconButton } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function TemporaryDrawer() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;
    const isLoggedIn = Boolean(localStorage.getItem('token'));

    return (
        <div>
            <IconButton onClick={() => setOpen(true)} style={{ color: 'white' }}>
                <MenuRoundedIcon className="link" />
            </IconButton>
            <Drawer anchor={"left"} open={open} onClose={() => setOpen(false)}>
                <div className="drawer-menu">
                    <Link to="/podcasts" className={currentPath === '/podcasts' ? 'active' : ""} onClick={() => setOpen(false)}>
                        Podcasts
                    </Link>
                    {isLoggedIn && (
                        <Link to="/create-a-podcast" className={currentPath === "/create-a-podcast" ? 'active' : ""} onClick={() => setOpen(false)}>
                            Create A Podcast
                        </Link>
                    )}
                    {isLoggedIn ? (
                        <Link to="/profile" className={currentPath === "/profile" ? 'active' : ""} onClick={() => setOpen(false)}>
                            Profile
                        </Link>
                    ) : (
                        <Link to="/" className={currentPath === '/' ? 'active' : ""} onClick={() => setOpen(false)}>
                            Sign Up
                        </Link>
                    )}
                </div>
            </Drawer>
        </div>
    );
}
