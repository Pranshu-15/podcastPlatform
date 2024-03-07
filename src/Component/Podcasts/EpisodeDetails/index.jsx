import React from "react";
import Button from "../../commonComponents/Button";

const EpisodeDetails = ({title , description , audioFile , onClick}) => {
    return(
        <>
                <h1 style={{textAlign:"left", marginBottom : 0}}>{title}</h1>
                <p className="podcast-description">{description}</p>
                <Button
                text={"Play"}
                onClick={()=> onClick(audioFile)}
                width={"200px"}
                />
        </>
    )
}
export default EpisodeDetails;