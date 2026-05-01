import React, { useEffect, useState, useRef } from "react";
import Header from "../Component/commonComponents/Header";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import AudioPlayer from "../Component/Podcasts/AudioPlayer";
import { gsap } from "gsap";
import "./PodcastDetails.css";

const PodcastDetailsPage = () => {
    const { id } = useParams();
    const [podcast, setPodcast] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [creator, setCreator] = useState(null);
    const [playingFile, setPlayingFile] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [nowPlaying, setNowPlaying] = useState({ title: '', podcast: '' });
    const navigate = useNavigate();

    const bannerRef = useRef(null);
    const infoRef = useRef(null);
    const episodesRef = useRef(null);

    // Fetch current user
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/auth/me').then(r => setCurrentUserId(r.data._id)).catch(() => {});
        }
    }, []);

    // Fetch podcast
    useEffect(() => {
        if (!id) return;
        api.get(`/podcasts/${id}`)
            .then(r => setPodcast({ id, ...r.data }))
            .catch(() => { toast.error("Podcast not found"); navigate('/podcasts'); });
    }, [id]);

    // Fetch episodes
    useEffect(() => {
        if (!id) return;
        api.get(`/episodes/${id}`)
            .then(r => setEpisodes(r.data.map(e => ({ id: e._id, ...e }))))
            .catch(() => {});
    }, [id]);

    // Fetch creator info
    useEffect(() => {
        if (!podcast?.createdBy) return;
        api.get(`/auth/users/${podcast.createdBy}`)
            .then(r => setCreator(r.data))
            .catch(() => {});
    }, [podcast?.createdBy]);

    // GSAP entrance when podcast loads
    useEffect(() => {
        if (!podcast) return;
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(bannerRef.current,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 0.8 }
        )
        .fromTo(infoRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.4"
        );
    }, [podcast]);

    // Handle episode button clicks — toggle or switch track
    const handleEpisodePlay = (audioFile, epTitle) => {
        if (playingFile === audioFile) {
            setIsPlaying(prev => !prev);
        } else {
            setPlayingFile(audioFile);
            setIsPlaying(true);
            setNowPlaying({ title: epTitle, podcast: podcast?.title || '' });
        }
    };

    // Stagger episodes when they load
    useEffect(() => {
        if (episodes.length > 0 && episodesRef.current?.children?.length) {
            gsap.fromTo(episodesRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.3 }
            );
        }
    }, [episodes]);

    if (!podcast) {
        return (
            <>
                <Header />
                <div className="pd-loading">Loading podcast...</div>
            </>
        );
    }

    const isOwner = podcast.createdBy === currentUserId;

    return (
        <>
            <Header />

            <div className="pd-blob pd-blob-1" />
            <div className="pd-blob pd-blob-2" />

            <div className="pd-page">

                {/* ── Banner ── */}
                <div className="pd-banner-wrapper" ref={bannerRef}>
                    <img
                        className="pd-banner-img"
                        src={podcast.bannerImage}
                        alt={podcast.title}
                        onError={e => { e.target.src = `https://picsum.photos/seed/${id}/1200/400`; }}
                    />
                    <div className="pd-banner-overlay" />

                    {/* Badge chip */}
                    {podcast.genre && (
                        <span className="pd-genre-chip">{podcast.genre}</span>
                    )}
                </div>

                {/* ── Podcast Info ── */}
                <div className="pd-info-section" ref={infoRef}>

                    {/* Display image + title row */}
                    <div className="pd-title-row">
                        <img
                            className="pd-display-img"
                            src={podcast.displayImage}
                            alt={podcast.title}
                            onError={e => { e.target.src = `https://picsum.photos/seed/${id}/200/200`; }}
                        />
                        <div className="pd-title-block">
                            <h1 className="pd-title">{podcast.title}</h1>
                            {creator && (
                                <p className="pd-creator">
                                    <span className="pd-creator-dot" />
                                    By {creator.name}
                                </p>
                            )}
                            <p className="pd-description">{podcast.description}</p>
                        </div>

                        {isOwner && (
                            <button
                                className="pd-create-ep-btn"
                                onClick={() => navigate(`/podcast/${id}/create-episode`)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="16"/>
                                    <line x1="8" y1="12" x2="16" y2="12"/>
                                </svg>
                                Create Episode
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Episodes ── */}
                <div className="pd-episodes-section">
                    <div className="pd-episodes-header">
                        <h2 className="pd-episodes-title">Episodes</h2>
                        <span className="pd-episodes-count">{episodes.length} episode{episodes.length !== 1 ? 's' : ''}</span>
                    </div>

                    {episodes.length > 0 ? (
                        <div className="pd-episodes-list" ref={episodesRef}>
                            {episodes.map((ep, idx) => (
                                <div
                                    key={ep.id}
                                    className={`pd-episode-card glass-panel ${playingFile === ep.audioFile ? 'pd-episode-playing' : ''}`}
                                >
                                    <div className="pd-ep-number">{String(idx + 1).padStart(2, '0')}</div>
                                    <div className="pd-ep-info">
                                        <h3 className="pd-ep-title">{ep.title}</h3>
                                        <p className="pd-ep-desc">{ep.description}</p>
                                    </div>
                                    <button
                                        className={`pd-play-btn ${playingFile === ep.audioFile && isPlaying ? 'pd-play-btn-active' : ''}`}
                                        onClick={() => handleEpisodePlay(ep.audioFile, ep.title)}
                                    >
                                        {playingFile === ep.audioFile && isPlaying ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <rect x="6" y="4" width="4" height="16"/>
                                                <rect x="14" y="4" width="4" height="16"/>
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <polygon points="5 3 19 12 5 21 5 3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="pd-no-episodes glass-panel">
                            <span className="pd-no-ep-icon">🎵</span>
                            <p>No episodes yet{isOwner ? '. Create your first one!' : '.'}</p>
                            {isOwner && (
                                <button
                                    className="pd-create-ep-btn"
                                    onClick={() => navigate(`/podcast/${id}/create-episode`)}
                                >
                                    + Create First Episode
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* ── Audio Player ── */}
            {playingFile && (
                <AudioPlayer
                    key={playingFile}
                    audioSrc={playingFile}
                    image={podcast.displayImage}
                    isPlaying={isPlaying}
                    onTogglePlay={setIsPlaying}
                    episodeTitle={nowPlaying.title}
                    podcastTitle={nowPlaying.podcast}
                />
            )}
        </>
    );
};

export default PodcastDetailsPage;