import React from "react";
import "./style.css"

const Button = ({text , onClick , disabled , width}) => {
    return(
        <>
            <div 
            onClick={onClick} 
            className="custom-btn"
             disabled={disabled} 
             style={{width:width}}
             >
             {text}
             </div>
        </>
    )
}
export default Button;