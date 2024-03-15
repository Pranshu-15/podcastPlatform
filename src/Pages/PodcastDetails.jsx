import React, { useEffect, useState } from "react";
import Header from "../Component/commonComponents/Header";
import { useNavigate, useParams } from "react-router-dom";
import {  collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import Button from "../Component/commonComponents/Button";
import EpisodeDetails from "../Component/Podcasts/EpisodeDetails";
import AudioPlayer from "../Component/Podcasts/AudioPlayer";


const PodcastDetailsPage = () => {
    
    const {id} = useParams();
    const [podcast , setPodcast] = useState({});
    const [episodes, setEpisodes] = useState([]);
    const navigate = useNavigate();
    const [playingFile , setPlayingFile] = useState("")
    const [user, setUser] = useState(null); // State to store user data
    console.log("ID" , id); 
    const getData = async () => {
        try{
            const docRef = doc(db, "podcasts", id);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
  setPodcast({id:id, ...docSnap.data() });
  console.log(podcast);
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such Podcast!");
  toast.error("No such Podcast!");
  navigate("/podcasts")
}
        }catch(e) {
            toast.error(e.message);
        }
    }
    useEffect(() => {
        if(id){
            getData();
        }
    },[id]);

    useEffect(()=>{
        const unsubscribe = onSnapshot(
            query(collection(db, "podcasts",id, "episodes")),
            (querySnapshot) => {
                const episodeData = [];
                querySnapshot.forEach((doc) => {
                    episodeData.push({id:doc.id, ...doc.data()});
                });
                setEpisodes(episodeData);
            },
            (error) => {
                console.log("Error fetching episodes:", error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [id])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "users", podcast.createdBy); // Assuming users are stored in a collection named "users"
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUser(userSnap.data());
                } else {
                    console.log("No such user!");
                    setUser(null);
                }
            } catch (error) {
                console.log("Error fetching user data:", error);
                setUser(null);
            }
        };

        if (podcast.createdBy) {
            fetchUserData();
        }
    }, [podcast.createdBy]);
    
    return(
        <>
        <Header />
        <div className="input-wrapper">
        {
            podcast.id && (
                <>
                <div style={{
                    display:"flex", 
                    justifyContent:"space-between", 
                    alignItems:"center"
                    }}
                > 
                <h1 className="podcast-title-heading">{podcast.title}</h1>
                {podcast.createdBy === auth.currentUser.uid && <Button
                width = {"12vw"}
                text={"Create Episode"}
                onClick={() =>{navigate(`/podcast/${id}/create-episode`)
                }} 

                />}
                </div>
               
                <div className="banner-wrapper">
                <img src={podcast.bannerImage} />
                </div>
                <p className="podcast-description">
                    {podcast.description}
                </p>
                <h1 className="podcast-episode-title-heading">Episodes</h1>
                {episodes.length > 0 ?
                <div style={{width:"100%"}}>
                {episodes.map((episode) => {
                    return(
                        <EpisodeDetails
                        key={episode.title}
                        title={episode.title}
                        description={episode.description}
                        audioFile={episode.audioFile}
                        onClick={(file)=> setPlayingFile(file)}
                        />
                    )
                })}
                </div>
                :<p>No episodes Found</p>}
                {user && <p>{`Created by: ${user.name}`}</p>}
                </>
                )}
        </div>
        {playingFile && <AudioPlayer
    key={playingFile} // Add key prop here
    audioSrc={playingFile}
    image={id.name}
/>}        
        </>
    )
}
export default PodcastDetailsPage;