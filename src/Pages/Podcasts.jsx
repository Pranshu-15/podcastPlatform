import React, { useEffect, useState } from "react";
import Header from "../Component/commonComponents/Header";
import {  collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setPodcasts } from "../slices/podcastSlice";
import PodcastCard from "../Component/Podcasts/PodcastCard";
import InputComponent from "../Component/commonComponents/Input";


const PodcastsPage = () => {
    const dispatch = useDispatch();
    const podcasts = useSelector((state) => state.podcasts.podcasts);
    const [search , setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState(""); // New state for selected genre
    const musicGenres = [
        "Pop",
        "Rock",
        "Jazz",
        "Blues",
        "Classical",
        "Hip Hop",
        "Rap",
        "Country",
        "Electronic",
        "Folk",
        "Reggae",
        "R&B (Rhythm and Blues)",
        "Metal",
        "Punk",
        "Funk",
        "Gospel",
        "Soul",
        "Alternative",
        "Indie",
        "Dance",
        "EDM (Electronic Dance Music)",
        "Ambient",
        "World",
        "Experimental",
        "Ska",
        "Dubstep",
        "Techno",
        "House",
        "Trance",
        "Grunge",
        "Industrial",
        "Psychedelic",
        "Disco",
        "Garage Rock",
        "Reggaeton",
        "Mariachi",
        "Bluegrass",
        "Flamenco",
        "Celtic",
        "Opera",
        "Baroque",
        "Salsa",
        "Merengue",
        "Tango",
        "K-Pop (Korean Pop)",
        "J-Pop (Japanese Pop)",
        "Bossa Nova",
        "Afrobeat",
        "Soca",
        "Zydeco"
    ];
    useEffect(() => {
        let queryRef = collection(db, "podcasts");

        if (selectedGenre) {
            queryRef = query(queryRef, where("genre", "==", selectedGenre));
        }
        const unsubscribe = onSnapshot(
            queryRef,
            query(collection(db, "podcasts"), where("genre", "==", selectedGenre)), // Filter by selected genre),
            (querySnapshot) =>{
                const podcastsData = [];
                querySnapshot.forEach((doc) => {
                    podcastsData.push({id: doc.id, ...doc.data()})
                });
                dispatch(setPodcasts(podcastsData));
            },
            (error) => {
                console.log("Error Fetching podcasts:" , error);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [dispatch , selectedGenre]);

    var filteredPodcasts = podcasts.filter((item) => 
    item.title.trim().toLowerCase().includes(search.toLowerCase()))
    return(
        <>
            <Header />
            <div className="input-wrapper">
            <h1>DIscover Podcasts</h1>
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                    <option value="">Select Genre</option>
                    {musicGenres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
            <InputComponent
                state={search} 
                setState = {setSearch} 
                placeholder="Search by Title" 
                type="text"
                />
                
            {
                filteredPodcasts.length > 0 ? (
                    <div className="podcasts-flex" style = {{marginTop:"1.5rem"}}>
                      {filteredPodcasts.map((item) => {
                        return (
                        <PodcastCard  
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        displayImage={item.displayImage}
                        genre={item.genre} // Pass the genre prop
                        />
                        )
                    })}
                    </div>
                    ) 
                    :
                     (<p>No Podcasts Created Yet!!</p>)
            }
            </div>
        </>
    )
}
export default PodcastsPage;