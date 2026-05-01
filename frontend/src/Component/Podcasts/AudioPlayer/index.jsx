import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const AudioPlayer = ({ audioSrc, image, isPlaying, onTogglePlay, episodeTitle, podcastTitle }) => {
    const [isMute, setIsMute] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const audioRef = useRef();
    const progressRef = useRef();

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    // ── Handlers ──
    const handleProgressClick = (e) => {
        const rect = progressRef.current.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const newTime = ratio * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        audioRef.current.volume = val;
        if (val === 0) setIsMute(true);
        else setIsMute(false);
    };

    const toggleMute = () => {
        if (isMute) {
            audioRef.current.volume = volume || 1;
            setIsMute(false);
        } else {
            audioRef.current.volume = 0;
            setIsMute(true);
        }
    };

    const skipForward = () => { audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration); };
    const skipBackward = () => { audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0); };

    // ── Audio event listeners ──
    useEffect(() => {
        const audio = audioRef.current;
        const onTimeUpdate = () => { if (!isDragging) setCurrentTime(audio.currentTime); };
        const onLoaded = () => setDuration(audio.duration);
        const onEnded = () => { setCurrentTime(0); onTogglePlay(false); };

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("ended", onEnded);
        return () => {
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("ended", onEnded);
        };
    }, [isDragging]);

    // Sync play/pause
    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.play().catch(() => {});
        else audioRef.current.pause();
    }, [isPlaying]);

    // Reset on src change
    useEffect(() => {
        setCurrentTime(0);
        setDuration(0);
    }, [audioSrc]);

    const volumeIcon = isMute || volume === 0 ? (
        // muted
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
    ) : volume < 0.5 ? (
        // low
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
    ) : (
        // full
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
    );

    return (
        <div className="ap-bar">
            <audio ref={audioRef} src={audioSrc} />

            {/* Accent glow line at top */}
            <div className="ap-glow-line" />

            {/* ── LEFT: Artwork + Track Info ── */}
            <div className="ap-left">
                <div className="ap-artwork-wrapper">
                    <img className="ap-artwork" src={image} alt="podcast" />
                    <div className={`ap-artwork-ring ${isPlaying ? 'ap-artwork-spinning' : ''}`} />
                </div>
                <div className="ap-track-info">
                    <span className="ap-track-title">{episodeTitle || "—"}</span>
                    <span className="ap-track-podcast">{podcastTitle || ""}</span>
                </div>
            </div>

            {/* ── CENTER: Controls + Progress ── */}
            <div className="ap-center">
                <div className="ap-controls">
                    {/* Skip −10 */}
                    <button className="ap-btn ap-btn-skip" onClick={skipBackward} title="−10s">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                            <text x="9" y="14.5" fontSize="5" fill="currentColor" fontFamily="sans-serif">10</text>
                        </svg>
                    </button>

                    {/* Play / Pause */}
                    <button
                        className={`ap-btn ap-btn-play ${isPlaying ? 'ap-playing' : ''}`}
                        onClick={() => onTogglePlay(!isPlaying)}
                    >
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" rx="1"/>
                                <rect x="14" y="4" width="4" height="16" rx="1"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                        )}
                    </button>

                    {/* Skip +10 */}
                    <button className="ap-btn ap-btn-skip" onClick={skipForward} title="+10s">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                            <text x="9" y="14.5" fontSize="5" fill="currentColor" fontFamily="sans-serif">10</text>
                        </svg>
                    </button>
                </div>

                {/* Progress bar */}
                <div className="ap-progress-row">
                    <span className="ap-time">{formatTime(currentTime)}</span>
                    <div
                        className="ap-progress-track"
                        ref={progressRef}
                        onClick={handleProgressClick}
                    >
                        <div className="ap-progress-fill" style={{ width: `${progressPercent}%` }}>
                            <div className="ap-progress-thumb" />
                        </div>
                    </div>
                    <span className="ap-time">−{formatTime(duration - currentTime)}</span>
                </div>
            </div>

            {/* ── RIGHT: Volume ── */}
            <div className="ap-right">
                <button className="ap-btn ap-btn-vol" onClick={toggleMute}>
                    {volumeIcon}
                </button>
                <div className="ap-vol-track">
                    <input
                        type="range"
                        className="ap-vol-slider"
                        min={0} max={1} step={0.02}
                        value={isMute ? 0 : volume}
                        onChange={handleVolumeChange}
                    />
                    <div
                        className="ap-vol-fill"
                        style={{ width: `${(isMute ? 0 : volume) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;