import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import InputComponent from "../commonComponents/Input";
import { toast } from "react-toastify";
import Button from "../commonComponents/Button";
import FileInput from "../commonComponents/Input/FileInput";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import "./style.css";

const CreateAPodcastForm = () => {
    // const { id } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState();
    const [displayImage, setDisplayImage] = useState();
    const [bannerImage, setBannerImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState(""); // New state for genre
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const musicGenres = [
        "Pop",
        "Rock",
        "Jazz",
        "Blues",
        "Classical",
        "Hip Hop",
        "Rap",
        "Country",
        "Electronic",
        "Folk",
        "Reggae",
        "R&B (Rhythm and Blues)",
        "Metal",
        "Punk",
        "Funk",
        "Gospel",
        "Soul",
        "Alternative",
        "Indie",
        "Dance",
        "EDM (Electronic Dance Music)",
        "Ambient",
        "World",
        "Experimental",
        "Ska",
        "Dubstep",
        "Techno",
        "House",
        "Trance",
        "Grunge",
        "Industrial",
        "Psychedelic",
        "Disco",
        "Garage Rock",
        "Reggaeton",
        "Mariachi",
        "Bluegrass",
        "Flamenco",
        "Celtic",
        "Opera",
        "Baroque",
        "Salsa",
        "Merengue",
        "Tango",
        "K-Pop (Korean Pop)",
        "J-Pop (Japanese Pop)",
        "Bossa Nova",
        "Afrobeat",
        "Soca",
        "Zydeco"
    ];
    
    
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
                    bannerImage: bannerImageURL,
                    displayImage: displayImageURL,
                    genre: genre, // Include genre in podcast data
                    createdBy: auth.currentUser.uid,
                };
                const docRef = await addDoc(collection(db, "podcasts"), podcastData);
                setTitle("");
                setDescription("");
                setDisplayImage();
                setBannerImage();
                toast.success("Podcast is Successfully Created");
                setLoading(false);
                navigate(`/podcasts`);
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
                 <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="">Select Genre</option>
                {musicGenres.map((genre) => (
                    <option key={genre} value={genre}>
                        {genre}
                    </option>
                ))}
            </select>

                
                <Button
                    text={loading ? "Loading..." : "Create A Podcast"}
                    disabled={loading}
                    onClick={handlePodcastCreation}

                />
            </>
        )
    }

    export default CreateAPodcastForm;