import React from "react";
import  "./style.css"
const InputComponent = ({ type , state , placeholder , setState , required }) => {
    return (
        <>
            <input
                type={type}
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder={placeholder}
                required={true}
                className="custom-input"
            />
        </>
    )
}
export default InputComponent;
