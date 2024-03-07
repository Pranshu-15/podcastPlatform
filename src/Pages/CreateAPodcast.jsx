import React from "react";
import Header from "../Component/commonComponents/Header";
import CreateAPodcastForm from "../Component/StartAPodcast/CreateAPodcastForm";
const CreateAPodcastPage = () => {
    return(
        <>
        <Header/>
        <div className="input-wrapper">
            <h1>Create A Podcast</h1>
            <CreateAPodcastForm />
        </div>
        </>
    )
}
export default CreateAPodcastPage;