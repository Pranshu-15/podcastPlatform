import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { IconButton } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function TemporaryDrawer() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;
    return (
        <div>
            <IconButton onClick={() => setOpen(true)} style={{ color: 'white' }}><MenuRoundedIcon className="link" /></IconButton>
            <Drawer anchor={"left"} open={open} onClose={() => setOpen(false)}>
            <div className="drawer-menu">
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
            </Drawer>
        </div>
    );
}
