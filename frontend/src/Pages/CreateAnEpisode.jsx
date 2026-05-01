import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Component/commonComponents/Header";
import InputComponent from "../Component/commonComponents/Input";
import FileInput from "../Component/commonComponents/Input/FileInput";
import Button from "../Component/commonComponents/Button";
import { toast } from "react-toastify";
import api from "../api/axios";
import { gsap } from "gsap";
import "./CreateAnEpisode.css";

const CreateAnEpisodePage = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(formRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 }
        );
    }, []);

    const handleEpisodeCreation = async () => {
        if (!title || !description) {
            toast.error("Title and description are required");
            return;
        }
        if (!audioFile) {
            toast.error("Please upload an audio file");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('audioFile', audioFile);

            await api.post(`/episodes/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Episode created successfully!");
            navigate(`/podcasts/podcast/${id}`);
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to create episode");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="create-ep-blob blob-ep-a" />
            <div className="create-ep-blob blob-ep-b" />

            <div className="create-ep-page">
                <div className="create-ep-card glass-panel" ref={formRef}>

                    {/* Header */}
                    <div className="create-ep-header">
                        <div className="create-ep-icon">🎧</div>
                        <div>
                            <h1 className="create-ep-title">Create an Episode</h1>
                            <p className="create-ep-subtitle">Add a new episode to your podcast</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="create-ep-form">

                        <div className="form-field">
                            <label className="form-label">Episode Title <span className="required">*</span></label>
                            <InputComponent
                                state={title}
                                setState={setTitle}
                                placeholder="Episode 1: Getting Started"
                                type="text"
                                required={true}
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Description <span className="required">*</span></label>
                            <InputComponent
                                state={description}
                                setState={setDescription}
                                placeholder="What is this episode about?"
                                type="text"
                                required={true}
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Audio File <span className="required">*</span></label>
                            <FileInput
                                accept="audio/*"
                                id="audio-file-input"
                                text={audioFile ? `✓ ${audioFile.name}` : "Upload Audio File"}
                                fileHandle={(file) => setAudioFile(file)}
                            />
                            {audioFile && (
                                <p className="file-hint">
                                    {(audioFile.size / (1024 * 1024)).toFixed(2)} MB · {audioFile.type}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="create-ep-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => navigate(`/podcasts/podcast/${id}`)}
                                type="button"
                            >
                                Cancel
                            </button>
                            <Button
                                text={loading ? "Uploading..." : "Publish Episode"}
                                disabled={loading}
                                onClick={handleEpisodeCreation}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateAnEpisodePage;