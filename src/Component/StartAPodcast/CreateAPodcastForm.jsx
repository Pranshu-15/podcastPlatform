import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponent from "../commonComponents/Input";
import { toast } from "react-toastify";
import Button from "../commonComponents/Button";
import FileInput from "../commonComponents/Input/FileInput";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const CreateAPodcastForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState();
    const [displayImage, setDisplayImage] = useState();
    const [bannerImage, setBannerImage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handlePodcastCreation = async () => {
        toast.success("Handling Form");
        if (title && description && displayImage && bannerImage) {
            setLoading(true);
            try {
                const displayImageRef = ref(storage, `podcasts/${auth.currentUser.uid}/${Date.now()}`);
                await uploadBytes(displayImageRef, displayImage);
                const displayImageURL = await getDownloadURL(displayImageRef);
                console.log("displayImage", displayImageURL);
                toast.success("Display Image Uploaded Successfully");

                const bannerImageRef = ref(storage, `podcasts/${auth.currentUser.uid}/${Date.now()}`);
                await uploadBytes(bannerImageRef, bannerImage);
                const bannerImageURL = await getDownloadURL(bannerImageRef);
                console.log("bannerImage", bannerImageURL);
                toast.success("Banner Image Uploaded Successfully");

                const podcastData = {
                    title: title,
                    description: description,
                    bannerImage:bannerImageURL,
                    displayImage:displayImageURL,
                    createdBy:auth.currentUser.uid,
                };
                const docRef = await addDoc(collection(db, "podcasts"), podcastData);
                setTitle("");
                setDescription("");
                setDisplayImage();
                setBannerImage();
                toast.success("Podcast is Successfully Created");
                setLoading(false);
            } catch (e) {
                toast.error(e.message);
                console.log(e);
                setLoading(false);
            }
        } else {
            toast.error("Fill all the necessary fields ")
            setLoading(false);
        }
        
    }
    const displayImageHandle = (file) => {
        setDisplayImage(file);
    }
    const bannerImageHandle = (file) => {
        setBannerImage(file);
    }

    return (
        <>
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
                accept={"image/*"}
                id="display-image-input"
                text="Upload Display Image"
                fileHandle={displayImageHandle}
            />
            <FileInput
                accept={"image/*"}
                id="banner-image-input"
                text="Upload Banner Image"
                fileHandle={bannerImageHandle}
            />
            <Button
                text={loading ? "Loading..." : "Create A Podcast"}
                disabled={loading}
                onClick={handlePodcastCreation}

            />
        </>
    )
}
export default CreateAPodcastForm;