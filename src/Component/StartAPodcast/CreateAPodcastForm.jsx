import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import InputComponent from "../commonComponents/Input";
import { toast } from "react-toastify";
import Button from "../commonComponents/Button";
import FileInput from "../commonComponents/Input/FileInput";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import "./style.css";

const CreateAPodcastForm = () => {
    const { id } = useParams();
    const [selectedGenre, setSelectedGenre] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState();
    const [displayImage, setDisplayImage] = useState();
    const [bannerImage, setBannerImage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const genres = [
        "Pop",
        "Rock",
        "Hip Hop",
        "R&B",
        "Country",
        "Jazz",
        "Classical",
        "Electronic",
        "Reggae",
        "Blues",
        "Folk",
        "Heavy Metal",
        "Punk",
        "Indie",
        "Funk",
        "Soul",
        "Gospel",
        "EDM",
        "Alternative",
        "Latin",
        "World",
        "Rap",
        "Techno",
        "Disco",
        "House",
        "Dubstep",
        "Trance",
        "Ska",
        "Trap",
        "Grime",
        "Ambient",
        "Chillout",
        "Instrumental",
        "Acoustic",
        "Experimental",
        "Reggaeton",
        "Salsa",
        "Merengue",
        "Bachata",
        "Cumbia",
        "Tango",
        "Mariachi",
        "Flamenco",
        "Samba",
        "Bossa Nova",
        "African",
        "Asian",
        "Indian",
        "Middle Eastern",
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

      
        const handleGenreChange = (event) => {
          setSelectedGenre(event.target.value);
        };

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

                <div className="custom-input">
                    <label htmlFor="genre">Choose a music genre:</label>
                    <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
                        <option value="">Select genre</option>
                        {genres.map((genre) => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>
                    <p>Selected genre: {selectedGenre}</p>
                </div>
                <Button
                    text={loading ? "Loading..." : "Create A Podcast"}
                    disabled={loading}
                    onClick={handlePodcastCreation}

                />
            </>
        )
    }

    export default CreateAPodcastForm;