import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

const PodcastCard = ({id , title , displayImage , genre }) => {
    return (
    <Link to={`podcast/${id}`}>
        <div className="podcast-card">
            <img className="display-image-podcast" src={displayImage} alt="display_image" />
            <p className="podcast-title">{title}</p>
            {genre && <p className="podcast-genre">{genre}</p>}
        </div>
    </Link>
)}
export default PodcastCard;