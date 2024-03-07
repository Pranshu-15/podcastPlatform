import React from "react";
import "./style.css"

const Loader = () => {
    return (
        <div className="loader-wrapper">
        {/* <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> */}
        <span className="loader"></span>
        </div>
    )
}
export default Loader;