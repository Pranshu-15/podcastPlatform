import React, { useEffect, useState } from "react";
import Header from "../Component/commonComponents/Header";
import {  collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setPodcasts } from "../slices/podcastSlice";
import PodcastCard from "../Component/Podcasts/PodcastCard";
import InputComponent from "../Component/commonComponents/Input";


const PodcastsPage = () => {
    const dispatch = useDispatch();
    const podcasts = useSelector((state) => state.podcasts.podcasts);
    const [search , setSearch] = useState("");
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "podcasts")),
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
    }, [dispatch]);

    var filteredPodcasts = podcasts.filter((item) => 
    item.title.trim().toLowerCase().includes(search.toLowerCase()))
    return(
        <>
            <Header />
            <div className="input-wrapper">
            <h1>DIscover Podcasts</h1>
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