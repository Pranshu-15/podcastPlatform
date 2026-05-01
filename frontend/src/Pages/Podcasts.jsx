import React, { useEffect, useState, useRef } from "react";
import Header from "../Component/commonComponents/Header";
import api from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setPodcasts } from "../slices/podcastSlice";
import PodcastCard from "../Component/Podcasts/PodcastCard";
import InputComponent from "../Component/commonComponents/Input";
import { gsap } from "gsap";

const PodcastsPage = () => {
    const dispatch = useDispatch();
    const podcasts = useSelector((state) => state.podcasts.podcasts);
    const [search, setSearch] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const headerRef = useRef(null);
    const cardsContainerRef = useRef(null);

    const musicGenres = [
        "Pop", "Rock", "Jazz", "Blues", "Classical", "Hip Hop", "Rap", "Country",
        "Electronic", "Folk", "Reggae", "R&B (Rhythm and Blues)", "Metal", "Punk",
        "Funk", "Gospel", "Soul", "Alternative", "Indie", "Dance", "EDM (Electronic Dance Music)",
        "Ambient", "World", "Experimental", "Ska", "Dubstep", "Techno", "House",
        "Trance", "Grunge", "Industrial", "Psychedelic", "Disco", "Garage Rock",
        "Reggaeton", "Mariachi", "Bluegrass", "Flamenco", "Celtic", "Opera", "Baroque",
        "Salsa", "Merengue", "Tango", "K-Pop (Korean Pop)", "J-Pop (Japanese Pop)",
        "Bossa Nova", "Afrobeat", "Soca", "Zydeco"
    ];

    useEffect(() => {
        const fetchPodcasts = async () => {
            try {
                const response = await api.get('/podcasts');
                let podcastsData = response.data;
                
                // Filter by genre on client side since backend doesn't support query params yet
                // Alternatively, backend could handle it if implemented, but client side is fine here.
                if (selectedGenre) {
                    podcastsData = podcastsData.filter(p => p.genre === selectedGenre);
                }
                
                // Map _id to id for compatibility with existing components
                podcastsData = podcastsData.map(p => ({ ...p, id: p._id }));
                
                dispatch(setPodcasts(podcastsData));
            } catch (error) {
                console.error("Error Fetching podcasts:", error);
            }
        };
        fetchPodcasts();
    }, [dispatch, selectedGenre]);

    // Initial page load animations
    useEffect(() => {
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.1 }
        );
    }, []);

    // Staggered cards animation whenever filteredPodcasts changes
    var filteredPodcasts = podcasts.filter((item) =>
        item.title?.trim().toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (filteredPodcasts.length > 0 && cardsContainerRef.current) {
            gsap.fromTo(
                cardsContainerRef.current.children,
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)" }
            );
        }
    }, [filteredPodcasts.length, selectedGenre, search]);

    return (
        <>
            <Header />
            <div className="ambient-blob" style={{ top: "10%", right: "5%", width: "400px", height: "400px", background: "rgba(102, 252, 241, 0.15)" }}></div>
            
            <div className="input-wrapper glass-panel" style={{ maxWidth: '1000px', margin: '5vh auto' }} ref={headerRef}>
                <h1>Discover Podcasts</h1>
                
                <div style={{ display: 'flex', gap: '1rem', width: '100%', marginBottom: '2rem' }}>
                    <select 
                        className="custom-input" 
                        value={selectedGenre} 
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        style={{ flex: 1, cursor: 'pointer' }}
                    >
                        <option value="">All Genres</option>
                        {musicGenres.map((genre) => (
                            <option key={genre} value={genre} style={{ background: 'var(--theme-secondary)' }}>
                                {genre}
                            </option>
                        ))}
                    </select>
                    
                    <div style={{ flex: 2 }}>
                        <InputComponent
                            state={search}
                            setState={setSearch}
                            placeholder="Search by Title..."
                            type="text"
                        />
                    </div>
                </div>

                {filteredPodcasts.length > 0 ? (
                    <div className="podcasts-flex" ref={cardsContainerRef} style={{ width: '100%' }}>
                        {filteredPodcasts.map((item) => (
                            <PodcastCard
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                displayImage={item.displayImage}
                                genre={item.genre}
                            />
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        No Podcasts Found
                    </p>
                )}
            </div>
        </>
    );
};

export default PodcastsPage;