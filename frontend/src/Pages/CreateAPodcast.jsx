import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Component/commonComponents/Header";
import InputComponent from "../Component/commonComponents/Input";
import FileInput from "../Component/commonComponents/Input/FileInput";
import Button from "../Component/commonComponents/Button";
import { toast } from "react-toastify";
import api from "../api/axios";
import { gsap } from "gsap";
import "./CreateAPodcast.css";

const musicGenres = [
    "Pop", "Rock", "Jazz", "Blues", "Classical", "Hip Hop", "Rap", "Country",
    "Electronic", "Folk", "Reggae", "R&B (Rhythm and Blues)", "Metal", "Punk",
    "Funk", "Gospel", "Soul", "Alternative", "Indie", "Dance",
    "EDM (Electronic Dance Music)", "Ambient", "World", "Experimental", "Ska",
    "Dubstep", "Techno", "House", "Trance", "Grunge", "Industrial", "Psychedelic",
    "Disco", "Garage Rock", "Reggaeton", "Mariachi", "Bluegrass", "Flamenco",
    "Celtic", "Opera", "Baroque", "Salsa", "Merengue", "Tango",
    "K-Pop (Korean Pop)", "J-Pop (Japanese Pop)", "Bossa Nova", "Afrobeat", "Soca", "Zydeco"
];

const CreateAPodcastPage = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [displayImage, setDisplayImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [genre, setGenre] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(formRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 }
        );
    }, []);

    const handlePodcastCreation = async () => {
        if (!title || !description || !genre) {
            toast.error("Title, description and genre are required");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('genre', genre);
            if (displayImage) formData.append('displayImage', displayImage);
            if (bannerImage) formData.append('bannerImage', bannerImage);

            await api.post('/podcasts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Podcast created successfully!");
            navigate('/podcasts');
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to create podcast");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="create-podcast-blob blob-a" />
            <div className="create-podcast-blob blob-b" />

            <div className="create-podcast-page">
                <div className="create-podcast-card glass-panel" ref={formRef}>

                    {/* Header */}
                    <div className="create-podcast-header">
                        <div className="create-podcast-icon">🎙️</div>
                        <div>
                            <h1 className="create-podcast-title">Create a Podcast</h1>
                            <p className="create-podcast-subtitle">Share your voice with the world</p>
                        </div>
                    </div>

                    {/* Form fields */}
                    <div className="create-podcast-form">

                        <div className="form-field">
                            <label className="form-label">Podcast Title <span className="required">*</span></label>
                            <InputComponent
                                state={title}
                                setState={setTitle}
                                placeholder="My Awesome Podcast"
                                type="text"
                                required={true}
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Description <span className="required">*</span></label>
                            <InputComponent
                                state={description}
                                setState={setDescription}
                                placeholder="What is your podcast about?"
                                type="text"
                                required={true}
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Genre <span className="required">*</span></label>
                            <select
                                className="custom-input genre-select"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                            >
                                <option value="" disabled>Select a genre...</option>
                                {musicGenres.map((g) => (
                                    <option key={g} value={g} style={{ background: '#1f2833' }}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label className="form-label">Display Image</label>
                                <FileInput
                                    accept="image/*"
                                    id="display-image-input"
                                    text="Upload Display Image"
                                    fileHandle={(file) => setDisplayImage(file)}
                                />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Banner Image</label>
                                <FileInput
                                    accept="image/*"
                                    id="banner-image-input"
                                    text="Upload Banner Image"
                                    fileHandle={(file) => setBannerImage(file)}
                                />
                            </div>
                        </div>

                        <div className="create-podcast-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => navigate('/podcasts')}
                                type="button"
                            >
                                Cancel
                            </button>
                            <Button
                                text={loading ? "Creating..." : "Create Podcast"}
                                disabled={loading}
                                onClick={handlePodcastCreation}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateAPodcastPage;