import React, { useState } from "react";
import Header from "../Component/commonComponents/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import InputComponent from "../Component/commonComponents/Input";
import FileInput from "../Component/commonComponents/Input/FileInput";
import Button from "../Component/commonComponents/Button";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const CreateAnEpisodePage = () => {
    const {id} = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [audioFile, setAudioFile] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const audioFileHandle = (file) => {
        setAudioFile(file);
    }
    const handleEpisodeCreation = async (e) => {
        setLoading(true);
        if(title , description , audioFile , id){
            try{
                const audioRef = ref(
                    storage,
                    `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
                );
                await uploadBytes(audioRef , audioFile);

                const audioURL = await getDownloadURL(audioRef);
                const episodeData = {
                    title:title,
                    description:description,
                    audioFile:audioURL,
                };

                await addDoc(
                    collection(db, "podcasts", id, "episodes"),
                    episodeData
                );
                toast.success("Episode Created Successfully")
                setLoading(false);
                navigate(`/podcasts/podcast/${id}`);
                setTitle("");
                setDescription("");
                setAudioFile("");
            } catch(e) {
                toast.error(e.message);
                setLoading(false);
            }
        } else{
            toast.error("All fields are necessary");
            setLoading(false);
        }
    }
    return(
        <>
        <Header/>
        <div className="input-wrapper">
            <h1>Create an Episode</h1>
            <InputComponent
                state={title}
                setState={setTitle}
                placeholder="Title"
                type="text"
                required={true}
            />
            <InputComponent
                state={description}
                setState={setDescription}
                placeholder="Description"
                type="text"
                required={true}
            />
            <FileInput
                accept={"audio/*"}
                id="audio-file-input"
                text="Upload Audio File"
                fileHandle={audioFileHandle}
            />
            <Button
                text={loading ? "Loading..." : "Create An Episode"}
                disabled={loading}
                onClick={handleEpisodeCreation}

            />
            </div>
        </>
    )
}

export default CreateAnEpisodePage;