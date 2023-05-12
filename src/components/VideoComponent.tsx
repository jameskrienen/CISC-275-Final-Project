import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDrag } from "react-dnd";
import { Video } from "../interfaces/VideoInterface";

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
    updateWatchList,
    deleteCentralVid,
    deleteCreatorVid,
    deleteReviewVid,
    deleteWatchVid,
    approveVid,
    role
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
    updateWatchList: (vid: Video) => void;
    deleteCentralVid: (vid: Video) => void;
    deleteCreatorVid: (vid: Video) => void;
    deleteReviewVid: (vid: Video) => void;
    deleteWatchVid: (vid: Video) => void;
    approveVid: (vid: Video) => void;
    role: string;
}) {
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
        wantToComment
    });

    function deleteFromSite(vid: Video) {
        deleteCentralVid(vid);
        deleteCreatorVid(vid);
        deleteReviewVid(vid);
        deleteWatchVid(vid);
    }

    function updateLikes() {
        const newVideo = { ...video, likes: video.likes + 1 };
        setVideo(newVideo);
        updateCentralList(newVideo);
        updateModeratorList(newVideo);
        updateWatchList(newVideo);
        updateCreatorList(newVideo);
    }
    function update() {
        const newVideo = { ...video, wantRecommended: !video.wantRecommended };
        setVideo(newVideo);
    }
    function updateReported() {
        const newVideo = { ...video, isReported: !video.isReported };
        setVideo(newVideo);
        updateCentralList(newVideo);
        updateModeratorList(newVideo);
        updateWatchList(newVideo);
        updateCreatorList(newVideo);
    }

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "VIDEO",
        item: { name: video.name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    const [textbox, setTextBox] = useState<boolean>(false);
    function showTextBox() {
        setTextBox(!textbox);
    }
    const [comments, setComments] = useState<string>("");
    function updateComments(event: React.ChangeEvent<HTMLInputElement>) {
        setComments(event.target.value);
    }

    function updateCommentsOnLists() {
        const newVideo = {
            ...video,
            commentList: [...video.commentList, comments]
        };
        setVideo(newVideo);
        updateCentralList(newVideo);
        updateModeratorList(newVideo);
        updateCreatorList(newVideo);
        updateWatchList(newVideo);
    }

    return (
        <>
            <div
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
                    <span style={{ fontWeight: "bold" }}>Description: </span>
                    <span>{video.description}</span>
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
                    <span hidden={role !== "moderator"}>
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
