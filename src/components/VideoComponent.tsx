import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDrag } from "react-dnd";
import { Video } from "../interfaces/VideoInterface";
import { Viewer } from "../interfaces/ViewerInterface";

function VideoComponent({
    name,
    description,
    genre,
    recommended,
    isReported,
    thumbnail,
    wantRecommended,
    likes,
    creator,
    inWatchlist,
    commentList,
    wantToComment,
    updateCentralList,
    updateModeratorList,
    updateCreatorList,
    deleteCentralVid,
    deleteCreatorVid,
    deleteReviewVid,
    deleteWatchVid,
    approveVid,
    index,
    role,
    dropdown,
    currentViewer,
    viewers
}: {
    name: string;
    description: string;
    genre: string;
    recommended: string[];
    isReported: boolean;
    thumbnail: string;
    wantRecommended: boolean;
    likes: number;
    creator: string;
    commentList: string[];
    inWatchlist: boolean;
    wantToComment: boolean;
    updateCentralList: (vid: Video) => void;
    updateModeratorList: (vid: Video) => void;
    updateCreatorList: (vid: Video) => void;
    deleteCentralVid: (vid: Video) => void;
    deleteCreatorVid: (vid: Video) => void;
    deleteReviewVid: (vid: Video) => void;
    deleteWatchVid: (
        vid: Video,
        index: number,
        specific: boolean,
        name: string
    ) => void;
    approveVid: (vid: Video) => void;
    index: number;
    role: string;
    dropdown: boolean;
    currentViewer: string;
    viewers: Viewer[];
}) {
    // State to keep track of all current video attributes
    const [video, setVideo] = useState<Video>({
        name,
        description,
        genre,
        recommended,
        wantRecommended,
        isReported,
        thumbnail,
        likes,
        commentList,
        creator,
        wantToComment,
        dropdown
    });

    // State to keep track of if the user is editing in their watchlist
    const [editMode, setEditMode] = useState<boolean>(false);
    // Updates state of edit mode
    function updateEditMode(event: React.ChangeEvent<HTMLInputElement>) {
        setEditMode(event.target.checked);
    }

    // Deletes the video from all lists on the website
    function deleteFromSite(vid: Video) {
        deleteCentralVid(vid);
        deleteCreatorVid(vid);
        deleteReviewVid(vid);
        deleteWatchVid(vid, index, false, currentViewer);
    }

    // Updates visibility of description in current list when changed
    function updateDropdown() {
        const newVideo = { ...video, dropdown: !video.dropdown };
        setVideo(newVideo);
    }

    // Updates the likes on a video in all lists when changed
    function updateLikes() {
        const newVideo = { ...video, likes: video.likes + 1 };
        setVideo(newVideo);
        updateCentralList(newVideo);
        updateModeratorList(newVideo);
        updateCreatorList(newVideo);
    }

    // Updates the visibility of recommended tab on video in all watchlist when changed
    function update() {
        const newVideo = { ...video, wantRecommended: !video.wantRecommended };
        setVideo(newVideo);
    }

    // Updates the reported state on video in all lists when changed
    function updateReported() {
        const newVideo = { ...video, isReported: !video.isReported };
        setVideo(newVideo);
        updateCentralList(newVideo);
        updateModeratorList(newVideo);
        updateCreatorList(newVideo);
    }

    // All videos can be dragged. They can be dropped into user watchlists
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "VIDEO",
        item: { name: video.name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    // State to keep track of if the textbox is shown or not
    const [textbox, setTextBox] = useState<boolean>(false);
    // Flips visibility of textbox
    function showTextBox() {
        setTextBox(!textbox);
    }

    // State to keep track of comment in textbox
    const [comments, setComments] = useState<string>("");
    // Updates state of comments
    function updateComments(event: React.ChangeEvent<HTMLInputElement>) {
        setComments(event.target.value);
    }

    // Updates comments on each video in all lists
    function updateCommentsOnLists() {
        const newVideo = {
            ...video,
            commentList: [...video.commentList, comments]
        };
        setVideo(newVideo);
        updateCentralList(newVideo);
        updateModeratorList(newVideo);
        updateCreatorList(newVideo);
    }

    // State to keep track of genre and title in textbox
    const [currentTitle, setCurrentTitle] = useState<string>("");
    const [currentGenre, setCurrentGenre] = useState<string>("");

    // Update edited title in textbox
    function updateCurrentTitle(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentTitle(event.target.value);
    }
    // Update edited title in watchlist
    function updateWatchlistTitle() {
        const newVideo = { ...video, name: currentTitle };
        setVideo(newVideo);
    }

    // Update edited genre in textbox
    function updateCurrentGenre(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentGenre(event.target.value);
    }
    // Update edited genre in watchlist
    function updateWatchlistGenre() {
        const newVideo = { ...video, genre: currentGenre };
        setVideo(newVideo);
    }

    return (
        <>
            <div
                data-testid="video-component"
                ref={drag}
                style={{
                    border: isDragging ? "5px solid black" : "0px",
                    opacity: isDragging ? "50%" : "100%",
                    marginTop: "10px",
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: "lightgray",
                    borderRadius: "15px"
                }}
            >
                <h5>{video.name}</h5>
                <div>
                    <Button
                        onClick={() => {
                            updateDropdown();
                        }}
                    >
                        Description⬇️
                    </Button>
                    <span>{video.dropdown ? video.description : ""}</span>
                </div>
                <div>
                    <span style={{ fontWeight: "bold" }}>Genre: </span>
                    <span>{video.genre}</span>
                </div>
                <img
                    width={"170px"}
                    src={video.thumbnail}
                    alt={video.name}
                ></img>
                <div style={{ marginTop: "10px" }}>
                    <span style={{ marginRight: "5px" }}>
                        <Button
                            onClick={() => {
                                updateReported();
                            }}
                            style={{
                                backgroundColor: "#2a52be",
                                color: "white",
                                border: "2px solid black"
                            }}
                        >
                            Report {video.isReported === true ? "🚩" : " "}
                        </Button>
                    </span>
                    <span>
                        <Button
                            onClick={() => {
                                updateLikes();
                            }}
                            style={{
                                backgroundColor: "#2a52be",
                                color: "white",
                                border: "2px solid black"
                            }}
                        >
                            👍
                        </Button>
                        {video.likes}
                    </span>
                    <span style={{ marginLeft: "10px" }}>
                        <Button
                            onClick={() => {
                                update();
                            }}
                            style={{
                                backgroundColor: "#2a52be",
                                color: "white",
                                border: "2px solid black"
                            }}
                        >
                            Recommended
                        </Button>
                        {video.wantRecommended === true ? (
                            <span>
                                <li>{video.recommended[0]}</li>
                                <li>{video.recommended[1]}</li>
                                <li>{video.recommended[2]}</li>
                                <li>{video.recommended[3]}</li>
                            </span>
                        ) : (
                            <span />
                        )}
                    </span>
                    <span hidden={role === "viewer"}>
                        <Button
                            onClick={() => {
                                deleteFromSite(video);
                            }}
                        >
                            Delete❌
                        </Button>
                    </span>
                    <span hidden={role !== "moderator"}>
                        <Button
                            onClick={() => {
                                updateReported();
                                approveVid(video);
                            }}
                        >
                            Reviewed✔️
                        </Button>
                    </span>
                    <span hidden={role !== "creator"}>
                        <div>
                            Viewers:
                            {viewers.map((viewer: Viewer) => (
                                <ul key={viewer.username}>{viewer.username}</ul>
                            ))}
                        </div>
                    </span>
                    <span hidden={!inWatchlist}>
                        <Button
                            onClick={() =>
                                deleteWatchVid(
                                    video,
                                    index,
                                    true,
                                    currentViewer
                                )
                            }
                            style={{
                                marginLeft: "5px"
                            }}
                        >
                            ❌
                        </Button>
                        <Form.Switch
                            type="switch"
                            id="edit-mode-check"
                            label="Enter Edit Mode"
                            checked={editMode}
                            onChange={updateEditMode}
                        />
                        <div hidden={!editMode}>
                            <span>
                                <Form.Label>New Title in your List:</Form.Label>
                                <Form.Control
                                    value={currentTitle}
                                    onChange={updateCurrentTitle}
                                ></Form.Control>
                                <Button onClick={updateWatchlistTitle}>
                                    Change Title
                                </Button>
                            </span>
                            <span>
                                <Form.Label>New Genre in your List:</Form.Label>
                                <Form.Control
                                    value={currentGenre}
                                    onChange={updateCurrentGenre}
                                ></Form.Control>
                                <Button onClick={updateWatchlistGenre}>
                                    Change Genre
                                </Button>
                            </span>
                        </div>
                    </span>
                </div>
            </div>
            <div hidden={!inWatchlist}>
                <Button
                    onClick={() => {
                        showTextBox();
                        textbox === true
                            ? updateCommentsOnLists()
                            : showTextBox();
                    }}
                >
                    {textbox === false ? (
                        <span>Comment</span>
                    ) : (
                        <span>Publish</span>
                    )}
                </Button>
                <Form.Group controlId="formVideoComment">
                    <Form.Control
                        key={video.name}
                        value={comments}
                        onChange={updateComments}
                        hidden={textbox === false}
                    />
                </Form.Group>
                <span>
                    {
                        <div>
                            {video.commentList.map((comment: string) => (
                                <li
                                    style={{
                                        listStyleType: "none",
                                        borderBottom: "1px solid black"
                                    }}
                                    key={comment}
                                >
                                    {comment}
                                </li>
                            ))}
                        </div>
                    }
                </span>
            </div>
        </>
    );
}
export default VideoComponent;
