import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Component/commonComponents/Header";
import { toast } from "react-toastify";
import Loader from "../Component/commonComponents/Loader";
import api from "../api/axios";
import { setUser } from "../slices/userSlice";
import PodcastCard from "../Component/Podcasts/PodcastCard";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./ProfilePage.css";

// ── Count up from 0 → target on mount ──
const AnimatedCounter = ({ value, delay = 0 }) => {
    const elRef = useRef(null);

    useEffect(() => {
        const obj = { val: 0 };
        gsap.to(obj, {
            val: value,
            duration: 1.6,
            delay,
            ease: "power2.out",
            onUpdate() {
                if (elRef.current) elRef.current.textContent = Math.round(obj.val);
            },
        });
    // Intentionally run only on mount — value is final when this mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <span ref={elRef}>0</span>;
};

// ── Typewriter effect, character by character ──
const DateReveal = ({ dateStr, delay = 0 }) => {
    const elRef = useRef(null);

    useEffect(() => {
        if (!dateStr || !elRef.current) return;
        // Render characters as individual spans, and handle newlines
        elRef.current.innerHTML = dateStr
            .split('')
            .map(ch => ch === '\n' ? '<br />' : `<span style="opacity:0;display:inline-block">${ch === ' ' ? '&nbsp;' : ch}</span>`)
            .join('');

        gsap.to(elRef.current.children, {
            opacity: 1,
            duration: 0.001,
            stagger: 0.07,
            delay,
            ease: "none",
        });
    // Intentionally run only on mount — dateStr is final when this mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <span ref={elRef} />;
};

const ProfilePage = () => {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // All data in local state so we know exactly when it's all ready
    const [profileData, setProfileData] = useState(null); // { name, email, profilePic, memberSince }
    const [podcastCount, setPodcastCount] = useState(null); // null = not loaded yet
    const [episodeCount, setEpisodeCount] = useState(null);
    const [userPodcasts, setUserPodcasts] = useState([]);

    // Refs for GSAP
    const heroRef = useRef(null);
    const avatarRef = useRef(null);
    const statsRef = useRef(null);
    const podcastsRef = useRef(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // 1. Get user
                const userRes = await api.get('/auth/me');
                const userData = userRes.data;

                dispatch(setUser({
                    name: userData.name,
                    email: userData.email,
                    uid: userData._id,
                    profilePic: userData.profilePic,
                }));

                const memberDate = userData.createdAt ? new Date(userData.createdAt) : null;

                setProfileData({
                    name: userData.name,
                    email: userData.email,
                    profilePic: userData.profilePic,
                    memberSince: memberDate
                        ? `${memberDate.toLocaleDateString('en-US', { month: 'long' })}\n${memberDate.getFullYear()}`
                        : null,
                });

                // 2. Get podcasts
                const podcastsRes = await api.get('/podcasts');
                const myPodcasts = podcastsRes.data
                    .filter(p => p.createdBy === userData._id)
                    .map(p => ({ ...p, id: p._id }));

                setUserPodcasts(myPodcasts);
                setPodcastCount(myPodcasts.length);

                // 3. Count episodes across all podcasts
                let total = 0;
                if (myPodcasts.length > 0) {
                    const counts = await Promise.all(
                        myPodcasts.map(p =>
                            api.get(`/episodes/${p.id}`).then(r => r.data.length).catch(() => 0)
                        )
                    );
                    total = counts.reduce((s, c) => s + c, 0);
                }
                setEpisodeCount(total);

            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchAll();
    }, [dispatch]);

    // GSAP entrance — runs once everything is loaded
    const allReady = profileData && podcastCount !== null && episodeCount !== null;

    useEffect(() => {
        if (!allReady) return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(heroRef.current,
            { opacity: 0, y: -40 },
            { opacity: 1, y: 0, duration: 0.8 }
        )
        .fromTo(avatarRef.current,
            { opacity: 0, scale: 0.5, rotation: -15 },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)" },
            "-=0.4"
        )
        .fromTo(statsRef.current?.children || [],
            { y: 40, scale: 0.92 },
            { y: 0, scale: 1, duration: 0.5, stagger: 0.12 },
            "-=0.3"
        )
        .fromTo(podcastsRef.current?.children || [],
            { opacity: 0, y: 50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.2)" },
            "-=0.2"
        );
    }, [allReady]);

    if (!allReady) return <Loader />;

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(setUser(null));
        toast.success("Logged out successfully");
        navigate('/');
    };

    const initials = profileData.name
        ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <>
            <Header />

            <div className="profile-blob blob-1" />
            <div className="profile-blob blob-2" />
            <div className="profile-blob blob-3" />

            <div className="profile-page">

                {/* ── Hero Section ── */}
                <div className="profile-hero glass-panel" ref={heroRef}>
                    <div className="profile-hero-bg" />

                    <div className="profile-avatar-wrapper" ref={avatarRef}>
                        <div className="profile-avatar-ring" />
                        <img
                            className="profile-avatar"
                            src={profileData.profilePic}
                            alt={profileData.name}
                            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                        <div className="profile-avatar-fallback" style={{ display: 'none' }}>{initials}</div>
                    </div>

                    <div className="profile-hero-info">
                        <div className="profile-greeting">Welcome back</div>
                        <h1 className="profile-name">{profileData.name}</h1>
                        <p className="profile-email">{profileData.email}</p>

                        <div className="profile-badges">
                            <span className="profile-badge">
                                <span className="badge-dot" />
                                Creator
                            </span>
                            <span className="profile-badge badge-muted">
                                {podcastCount} Podcast{podcastCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    <button className="profile-logout-btn" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sign Out
                    </button>
                </div>

                {/* ── Stats Row ── */}
                <div className="profile-stats" ref={statsRef}>
                    <div className="stat-card glass-panel">
                        <div className="stat-value">
                            {/* delay matches hero(0.8) + avatar overlap + stats slide start ~0.8s */}
                            <AnimatedCounter key={`pods-${podcastCount}`} value={podcastCount} delay={0.9} />
                        </div>
                        <div className="stat-label">Podcasts Created</div>
                    </div>
                    <div className="stat-card glass-panel">
                        <div className="stat-value">
                            <AnimatedCounter key={`eps-${episodeCount}`} value={episodeCount} delay={1.0} />
                        </div>
                        <div className="stat-label">Total Episodes</div>
                    </div>
                    <div className="stat-card glass-panel">
                        <div className="stat-value" style={{ fontSize: '1.3rem' }}>
                            {profileData.memberSince
                                ? <DateReveal key={profileData.memberSince} dateStr={profileData.memberSince} delay={1.1} />
                                : '—'}
                        </div>
                        <div className="stat-label">Member Since</div>
                    </div>
                </div>

                {/* ── Action Bar ── */}
                <div className="profile-actions">
                    <button className="action-btn action-btn-primary" onClick={() => navigate('/create-a-podcast')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="16"/>
                            <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                        New Podcast
                    </button>
                    <button className="action-btn action-btn-ghost" onClick={() => navigate('/podcasts')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        Browse All
                    </button>
                </div>

                {/* ── Podcasts Section ── */}
                <div className="profile-podcasts-section">
                    <div className="section-header">
                        <h2 className="section-title">Your Podcasts</h2>
                        <div className="section-line" />
                    </div>

                    {userPodcasts.length > 0 ? (
                        <div className="profile-podcasts-grid" ref={podcastsRef}>
                            {userPodcasts.map(item => (
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
                        <div className="profile-empty glass-panel">
                            <div className="empty-icon">🎙️</div>
                            <h3>No podcasts yet</h3>
                            <p>You haven't created any podcasts. Start your journey!</p>
                            <button className="action-btn action-btn-primary" onClick={() => navigate('/create-a-podcast')}>
                                Create Your First Podcast
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export default ProfilePage;
