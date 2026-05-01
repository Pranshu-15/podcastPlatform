import React, {  useState } from "react";
import  "./style.css";

const FileInput = ({accept , id , text , fileHandle}) => {
    const [fileSelected , setFileSelected] = useState("");
    const onChange = (event) => {
        if (!event.target.files || !event.target.files[0]) return;
        setFileSelected(event.target.files[0].name);
        fileHandle(event.target.files[0]);
    }
    
    return (
        <>
        <label 
        htmlFor={id} 
        className= {`custom-input ${!fileSelected ? "label-input" : "active"}`}
        >
        {fileSelected ? `The file ${fileSelected} is selected`: text}
        </label>
            <input
            type = "file"
            accept = {accept}
            id = {id}
            style = {{display : "none"}}
            onChange={onChange}
            />
        </>
    )
}
export default FileInput;