import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward } from "react-icons/fa"

const AudioPlayer = ({ audioSrc, image }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMute, setIsMute] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef();
    const handleDurationChange = (e) => {
        setCurrentTime(e.target.value);
        audioRef.current.currentTime = e.target.value;
    }
    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false);
        } else {
            setIsPlaying(true)
        }
    }
    const toggleMute = () => {
        if (isMute) {
            setIsMute(false);
        } else {
            setIsMute(true)
        }
    }
    const handleVolumeChange = (e) => {
        setVolume(e.target.value)
        audioRef.current.volume = e.target.value;
    }

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    }
    const handleLoadedMetaData = () => {
        setDuration(audioRef.current.duration)
    }
    const handleEnded = () => {
        setCurrentTime(0);
        setIsPlaying(false)
    }
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    };

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetaData);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.addEventListener("timeupdate", handleTimeUpdate);
            audio.addEventListener("loadedmetadata", handleLoadedMetaData);
            audio.addEventListener("ended", handleEnded);
        }
    }, [])

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    useEffect(() => {
        if (isMute) {
            audioRef.current.volume = 0;
            setVolume(0)
        } else {
            audioRef.current.volume = 1;
            setVolume(1)
        }
    }, [isMute])

    const skipForward = () => {
        audioRef.current.currentTime += 10;
    }

    const skipBackward = () => {
        audioRef.current.currentTime -= 10;
    }

    return (
        <>
            <div className="custom-audio-player">
                <image src={image} className="display-image-player" />

                <audio ref={audioRef} src={audioSrc} />

                <div className="player-icon-section">
                    <p className="audio-player-icon" onClick={skipBackward}><FaStepBackward /></p>
                    <p className="audio-player-icon" onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</p>
                    <p className="audio-player-icon" onClick={skipForward}>    <FaStepForward /></p>
                </div>

                <div className="player-duration-section">
                    <div className="duration-flex">
                        <p>{formatTime(currentTime)}</p>
                        <input
                            type="range"
                            max={duration}
                            value={currentTime}
                            onChange={handleDurationChange}
                            step={0.01}
                            className="duration-range audio-player-icon bar-height"
                        />
                        <p>-{formatTime(duration - currentTime)}</p>
                    </div>
                </div>

                <div className="player-volume-section">
                    <p className="audio-player-icon" onClick={toggleMute}>{isMute ? <FaVolumeMute /> : <FaVolumeUp />}</p>
                    <input
                        type="range"
                        onChange={handleVolumeChange}
                        className="volume-range audio-player-icon bar-height "
                        value={volume}
                        step={0.1}
                        min={0}
                        max={1}
                    />
                    <p>{volume * 100}%</p>
                </div>
            </div>
        </>
    )
}
export default AudioPlayer;