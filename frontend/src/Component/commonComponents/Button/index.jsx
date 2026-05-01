import React from "react";
import "./style.css"

const Button = ({text , onClick , disabled , width}) => {
    return(
        <>
            <button
            type="button"
            onClick={onClick}
            className="custom-btn"
            disabled={disabled}
            style={{width:width}}
            >
            {text}
            </button>
        </>
    )
}
export default Button;