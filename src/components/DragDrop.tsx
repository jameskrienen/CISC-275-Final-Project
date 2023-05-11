import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import "../App.css";
import VideoComponent from "./VideoComponent";
import { Video } from "../interfaces/VideoInterface";
import { VIDEOS } from "./allVideos";
import { Button, Col, Form, Row } from "react-bootstrap";
import "./DragDrop.css";
import { Creator } from "../interfaces/CreatorInterface";
import { Moderator } from "../interfaces/ModeratorInterface";
import placeholderimage from "../placeholder.jpeg";
import { Viewer } from "../interfaces/ViewerInterface";

function DragDrop({ role }: { role: string }): JSX.Element {
    const users = ["Dan", "Jess", "James"];
    const [currentModerator, setCurrentModerator] = useState<Moderator>({
        review_list: [],
        username: ""
    });

    function updateModerator(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentModerator({
            ...currentModerator,
            username: event.target.value
        });
    }
    const [currentCreator, setCurrentCreator] = useState<Creator>({
        username: "",
        createdVideos: [],
        flaggedVideos: [],
        blockedUsers: []
    });
    function updateCreator(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentCreator({
            ...currentCreator,
            username: event.target.value
        });
    }

    const [currentViewer, setCurrentViewer] = useState<Viewer>({
        username: "",
        watchlist: []
    });

    function updateViewer(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentViewer({ ...currentViewer, username: event.target.value });
    }

    const [allVideos, setAllVideos] = useState<Video[]>(VIDEOS);
    const [watchList, setWatchList] = useState<Video[]>([]);

    const [uploadMode, setUploadMode] = useState<boolean>(false);
    function updateMode(event: React.ChangeEvent<HTMLInputElement>) {
        setUploadMode(event.target.checked);
    }

    const [videoName, setName] = useState<string>("");
    function updateName(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    const [videoDescription, setDescription] = useState<string>("");
    function updateDescription(event: React.ChangeEvent<HTMLInputElement>) {
        setDescription(event.target.value);
    }

    const [videoGenre, setGenre] = useState<string>("");
    function updateGenre(event: React.ChangeEvent<HTMLInputElement>) {
        setGenre(event.target.value);
    }

    function updateCreatorVideos(newVideo: Video) {
        const videoNames: string[] = currentCreator.createdVideos.map(
            (vid: Video) => vid.name
        );
        if (
            !videoNames.includes(newVideo.name) &&
            newVideo.creator === currentCreator.username
        ) {
            const newCreator = {
                ...currentCreator,
                createdVideos: [...currentCreator.createdVideos, newVideo]
            };
            setCurrentCreator(newCreator);
            addVideoToCentralList(newVideo);
        } else {
            const newList = currentCreator.createdVideos.map((video: Video) => {
                return video.name === newVideo.name ? newVideo : video;
            });
            setCurrentCreator({ ...currentCreator, createdVideos: newList });
        }
    }

    useEffect(() => {
        console.log(allVideos);
    }, [allVideos]);

    function updateModeratorVideos(newVideo: Video) {
        const videoNames: string[] = currentModerator.review_list.map(
            (vid: Video) => vid.name
        );
        if (!videoNames.includes(newVideo.name) && newVideo.isReported) {
            const newModerator = {
                ...currentModerator,
                review_list: [...currentModerator.review_list, newVideo]
            };
            setCurrentModerator(newModerator);
        } else {
            const newList = currentModerator.review_list.map((video: Video) => {
                return video.name === newVideo.name ? newVideo : video;
            });
            setCurrentModerator({ ...currentModerator, review_list: newList });
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "VIDEO",
        drop: (item: Video) => addVideoToWatchlist(item.name),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }));

    function deleteVideoFromCentralList(vid: Video) {
        const newCentralList = allVideos.filter(
            (video: Video) => video.name !== vid.name
        );
        setAllVideos(newCentralList);
    }

    function deleteVideoFromCreatorList(vid: Video) {
        const newCreatorList = currentCreator.createdVideos.filter(
            (video: Video) => video.name !== vid.name
        );
        const newCreator = { ...currentCreator, createdVideos: newCreatorList };
        setCurrentCreator(newCreator);
    }

    function deleteFromReviewList(vid: Video) {
        const newList = currentModerator.review_list.filter(
            (video: Video) => video.name !== vid.name
        );
        const newModerator = { ...currentModerator, review_list: newList };
        setCurrentModerator(newModerator);
    }

    function approveVideo(vid: Video) {
        deleteFromReviewList(vid);
        updateCentralList({ ...vid, isReported: false });
        updateCreatorVideos({ ...vid, isReported: false });
        updateWatchList({ ...vid, isReported: false });
    }

    function deleteFromWatchList(vid: Video) {
        const newList = watchList.filter(
            (video: Video) => video.name !== vid.name
        );
        setWatchList(newList);
    }

    function addVideoToCentralList(video: Video) {
        const newVideos = [...allVideos, video];
        setAllVideos(newVideos);
    }

    function updateCentralList(toEdit: Video) {
        const vidNames = allVideos.map((video: Video) => video.name);
        if (vidNames.includes(toEdit.name)) {
            const newVideos = allVideos.map((video: Video) => {
                return video.name === toEdit.name ? toEdit : video;
            });
            setAllVideos(newVideos);
        }
    }

    function updateWatchList(toEdit: Video) {
        const vidNames = watchList.map((video: Video) => video.name);
        if (vidNames.includes(toEdit.name)) {
            const newVideos = watchList.map((video: Video) => {
                return video.name === toEdit.name ? toEdit : video;
            });
            setWatchList(newVideos);
        }
    }

    function addVideoToWatchlist(name: string) {
        const videoToAdd = allVideos.filter(
            (video: Video) => name === video.name
        );
        if (videoToAdd.length > 0) {
            setWatchList((watchList) => [...watchList, videoToAdd[0]]);
        }
    }

    const [filteredWatchlist, setFilteredWatchlist] = useState<string>("");
    function filterWatchlistAlphabet() {
        setFilteredWatchlist("Name");
        const sortedData = [...watchList].sort((vid1, vid2) => {
            return vid1.name.localeCompare(vid2.name);
        });
        setWatchList(sortedData);
    }

    function filterWatchlistGenre() {
        if (filteredWatchlist != null) {
            setFilteredWatchlist("Genre");
            const sortedData = [...watchList].sort((vid1, vid2) => {
                return vid1.genre === vid2.genre
                    ? vid1.name.localeCompare(vid2.name)
                    : vid1.genre.localeCompare(vid2.genre);
            });
            setWatchList(sortedData);
        }
    }
    const [filteredVideos, setFilteredVideos] = useState<string>("");
    function filterAlphabet() {
        setFilteredVideos("Name");
        const sortedData = [...allVideos].sort((vid1, vid2) => {
            return vid1.name.localeCompare(vid2.name);
        });
        setAllVideos(sortedData);
    }

    function filterGenre() {
        if (filteredVideos != null) {
            setFilteredVideos("Genre");
            const sortedData = [...allVideos].sort((vid1, vid2) => {
                return vid1.genre === vid2.genre
                    ? vid1.name.localeCompare(vid2.name)
                    : vid1.genre.localeCompare(vid2.genre);
            });
            setAllVideos(sortedData);
        }
    }

    const [comment, setComment] = useState<string>("");
    function updateComment(event: React.ChangeEvent<HTMLInputElement>) {
        setComment(event.target.value);
    }

    const [textbox, setTextBox] = useState<boolean>(false);
    function showTextBox(vid: Video) {
        //const updateVid = { ...vid, wantToComment: !vid.wantToComment };
        if (watchList.find((video) => video === vid)) {
            // if (updateVid.wantToComment === true) {
            setTextBox(!textbox);
            setWatchList(
                watchList.map((video: Video) =>
                    video === vid
                        ? { ...video, comment: comment }
                        : { ...video }
                )
            );
            // }
        } else {
            setTextBox(false);
        }

        //const newComment = comment;
        /*onst vidName = watchList.find((vid) => vid.name === name);
        console.log(vidName);
        console.log(name);*/
        // if (vidName.name === name) {

        //setComment(newComment);
        // }
    }

    return (
        <>
            <div hidden={role !== "viewer"}>
                <div className="lists">
                    <div className="centralList">
                        <div
                            style={{
                                fontWeight: "bold",
                                fontSize: "xx-large",
                                marginLeft: "50px"
                            }}
                        >
                            Videos:
                        </div>
                        <div>
                            <p
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "xx-large"
                                }}
                            >
                                What is your username?
                            </p>
                            <Form.Group>
                                <Form.Label>Username:</Form.Label>
                                <Form.Control
                                    value={currentViewer.username}
                                    onChange={updateViewer}
                                ></Form.Control>
                                <Form.Label>
                                    {users.includes(currentViewer.username)
                                        ? "Welcome "
                                        : ""}
                                    {users.includes(currentViewer.username)
                                        ? currentViewer.username
                                        : "Not a viewer"}
                                    {"!"}
                                </Form.Label>
                            </Form.Group>
                        </div>
                        <span style={{ marginLeft: "50px" }}>
                            <Button onClick={filterAlphabet}>Filter A-Z</Button>
                            <Button onClick={filterGenre}>
                                Filter by Genre
                            </Button>
                        </span>
                        <Row>
                            <Col style={{ columnCount: 3 }}>
                                {allVideos.map((video: Video) => {
                                    return (
                                        <ul
                                            key={video.name}
                                            style={{ breakInside: "avoid" }}
                                        >
                                            <VideoComponent
                                                key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}`}
                                                name={video.name}
                                                description={video.description}
                                                genre={video.genre}
                                                recommended={video.recommended}
                                                isReported={video.isReported}
                                                thumbnail={video.thumbnail}
                                                wantRecommended={
                                                    video.wantRecommended
                                                }
                                                likes={video.likes}
                                                creator={video.creator}
                                                comment={video.comment}
                                                wantToComment={
                                                    video.wantToComment
                                                }
                                                updateCentralList={
                                                    updateCentralList
                                                }
                                                updateModeratorList={
                                                    updateModeratorVideos
                                                }
                                                updateCreatorList={
                                                    updateCreatorVideos
                                                }
                                                updateWatchList={
                                                    updateWatchList
                                                }
                                                deleteCentralVid={
                                                    deleteVideoFromCentralList
                                                }
                                                deleteCreatorVid={
                                                    deleteVideoFromCreatorList
                                                }
                                                deleteReviewVid={
                                                    deleteFromReviewList
                                                }
                                                deleteWatchVid={
                                                    deleteFromWatchList
                                                }
                                                approveVid={approveVideo}
                                                role={role}
                                            ></VideoComponent>
                                        </ul>
                                    );
                                })}
                            </Col>
                        </Row>
                    </div>
                    <div className="watchList" ref={drop}>
                        <Row>
                            <Col style={{ columnCount: 1 }}>
                                <div
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "xx-large"
                                    }}
                                >
                                    Watchlist:
                                    <div>
                                        <Button
                                            onClick={filterWatchlistAlphabet}
                                        >
                                            Filter A-Z
                                        </Button>
                                        <Button onClick={filterWatchlistGenre}>
                                            Filter Genre
                                        </Button>
                                    </div>
                                </div>
                                {watchList.map((video: Video) => {
                                    return (
                                        <div
                                            key={`${video.name}-${currentUser}`}
                                        >
                                            <VideoComponent
                                                key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}`}
                                                name={video.name}
                                                description={video.description}
                                                genre={video.genre}
                                                recommended={video.recommended}
                                                isReported={video.isReported}
                                                thumbnail={video.thumbnail}
                                                wantRecommended={
                                                    video.wantRecommended
                                                }
                                                likes={video.likes}
                                                creator={video.creator}
                                                comment={video.comment}
                                                wantToComment={
                                                    video.wantToComment
                                                }
                                                updateCentralList={
                                                    updateCentralList
                                                }
                                                updateModeratorList={
                                                    updateModeratorVideos
                                                }
                                                updateCreatorList={
                                                    updateCreatorVideos
                                                }
                                                updateWatchList={
                                                    updateWatchList
                                                }
                                                deleteCentralVid={
                                                    deleteVideoFromCentralList
                                                }
                                                deleteCreatorVid={
                                                    deleteVideoFromCreatorList
                                                }
                                                deleteReviewVid={
                                                    deleteFromReviewList
                                                }
                                                deleteWatchVid={
                                                    deleteFromWatchList
                                                }
                                                approveVid={approveVideo}
                                                role={role}
                                            ></VideoComponent>
                                            <Button
                                                onClick={() =>
                                                    showTextBox(video)
                                                }
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
                                                    value={comment}
                                                    onChange={updateComment}
                                                    hidden={textbox === false}
                                                />
                                            </Form.Group>
                                            <span>
                                                Comments: {video.comment}
                                            </span>
                                        </div>
                                    );
                                })}
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <div hidden={role !== "moderator"}>
                <div className="moderatorList">
                    <Row>
                        <Col style={{ columnCount: 1 }}>
                            <div
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "xx-large"
                                }}
                            >
                                Review List:
                            </div>
                            <div>
                                <p
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "xx-large"
                                    }}
                                >
                                    What is your username?
                                </p>
                                <Form.Group>
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control
                                        value={currentModerator.username}
                                        onChange={updateModerator}
                                    ></Form.Control>
                                    <Form.Label>
                                        {users.includes(
                                            currentModerator.username
                                        )
                                            ? "Welcome "
                                            : ""}
                                        {users.includes(
                                            currentModerator.username
                                        )
                                            ? currentModerator.username
                                            : "Not a moderator"}
                                        {"!"}
                                    </Form.Label>
                                </Form.Group>
                            </div>
                            <div key={allVideos.length.toString()}>
                                {currentModerator.review_list.map(
                                    (video: Video) => {
                                        return (
                                            <VideoComponent
                                                key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}`}
                                                name={video.name}
                                                description={video.description}
                                                genre={video.genre}
                                                recommended={video.recommended}
                                                isReported={video.isReported}
                                                thumbnail={video.thumbnail}
                                                wantRecommended={
                                                    video.wantRecommended
                                                }
                                                likes={video.likes}
                                                creator={video.creator}
                                                comment={video.comment}
                                                wantToComment={
                                                    video.wantToComment
                                                }
                                                updateCentralList={
                                                    updateCentralList
                                                }
                                                updateModeratorList={
                                                    updateModeratorVideos
                                                }
                                                updateCreatorList={
                                                    updateCreatorVideos
                                                }
                                                updateWatchList={
                                                    updateWatchList
                                                }
                                                deleteCentralVid={
                                                    deleteVideoFromCentralList
                                                }
                                                deleteCreatorVid={
                                                    deleteVideoFromCreatorList
                                                }
                                                deleteReviewVid={
                                                    deleteFromReviewList
                                                }
                                                deleteWatchVid={
                                                    deleteFromWatchList
                                                }
                                                approveVid={approveVideo}
                                                role={role}
                                            ></VideoComponent>
                                        );
                                    }
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div hidden={role !== "creator"}>
                <div className="creatorList">
                    <span
                        style={{
                            fontWeight: "bold",
                            fontSize: "xx-large"
                        }}
                    >
                        Creator List:
                    </span>
                    <span>
                        <p
                            style={{
                                fontWeight: "bold",
                                fontSize: "xx-large"
                            }}
                        >
                            What is your username?
                        </p>
                        <Form.Group>
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                value={currentCreator.username}
                                onChange={updateCreator}
                            ></Form.Control>
                            <Form.Label>
                                {users.includes(currentCreator.username)
                                    ? "Welcome "
                                    : ""}
                                {users.includes(currentCreator.username)
                                    ? currentCreator.username
                                    : "Not a creator"}
                                {"!"}
                            </Form.Label>
                        </Form.Group>
                    </span>
                    <Row>
                        <Col style={{ columnCount: 1, display: "flex" }}>
                            {currentCreator.createdVideos.map(
                                (video: Video) => {
                                    return (
                                        <VideoComponent
                                            key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}`}
                                            name={video.name}
                                            description={video.description}
                                            genre={video.genre}
                                            recommended={video.recommended}
                                            isReported={video.isReported}
                                            thumbnail={video.thumbnail}
                                            wantRecommended={
                                                video.wantRecommended
                                            }
                                            likes={video.likes}
                                            creator={video.creator}
                                            comment={video.comment}
                                            wantToComment={video.wantToComment}
                                            updateCentralList={
                                                updateCentralList
                                            }
                                            updateModeratorList={
                                                updateModeratorVideos
                                            }
                                            updateCreatorList={
                                                updateCreatorVideos
                                            }
                                            updateWatchList={updateWatchList}
                                            deleteCentralVid={
                                                deleteVideoFromCentralList
                                            }
                                            deleteCreatorVid={
                                                deleteVideoFromCreatorList
                                            }
                                            deleteReviewVid={
                                                deleteFromReviewList
                                            }
                                            deleteWatchVid={deleteFromWatchList}
                                            approveVid={approveVideo}
                                            role={role}
                                        ></VideoComponent>
                                    );
                                }
                            )}
                        </Col>
                        <Col>
                            <Form.Switch
                                type="switch"
                                id="uploaf-mode-check"
                                label="Enter Upload Mode"
                                checked={uploadMode}
                                onChange={updateMode}
                            />
                            {uploadMode === true && role === "creator" ? (
                                <Form.Group controlId="formUserName">
                                    <Form.Label>Enter name:</Form.Label>
                                    <Form.Control
                                        value={videoName}
                                        onChange={updateName}
                                    />
                                    <Form.Label>Enter description:</Form.Label>
                                    <Form.Control
                                        value={videoDescription}
                                        onChange={updateDescription}
                                    />
                                    <Form.Label>Choose genre:</Form.Label>
                                    <Form.Check
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-music"
                                        label="Music"
                                        value="Music"
                                        checked={videoGenre === "Music"}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-gaming"
                                        label="Gaming"
                                        value="Gaming"
                                        checked={videoGenre === "Gaming"}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-sports"
                                        label="Sports"
                                        value="Sports"
                                        checked={videoGenre === "Sports"}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-comedy"
                                        label="Comedy"
                                        value="Comedy"
                                        checked={videoGenre === "Comedy"}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-education"
                                        label="Education"
                                        value="Education"
                                        checked={videoGenre === "Education"}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-howto"
                                        label="How-To"
                                        value="How-To"
                                        checked={videoGenre === "How-To"}
                                    />
                                    <Button
                                        onClick={() => {
                                            updateCreatorVideos({
                                                name: videoName,
                                                description: videoDescription,
                                                genre: videoGenre,
                                                recommended: [],
                                                isReported: false,
                                                thumbnail: placeholderimage,
                                                wantRecommended: false,
                                                likes: 0,
                                                creator:
                                                    currentCreator.username,
                                                comment: "",
                                                wantToComment: false
                                            });
                                        }}
                                    >
                                        Upload Video{" "}
                                    </Button>
                                </Form.Group>
                            ) : (
                                <span>{""}</span>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}
export default DragDrop;

/*
                                                    videoGenre === "Music"
                                                        ? musicRecommendations
                                                        : videoGenre ===
                                                          "Gaming"
                                                        ? gamingRecommendations
                                                        : videoGenre ===
                                                          "Sports"
                                                        ? sportsRecommendations
                                                        : videoGenre ===
                                                          "Comedy"
                                                        ? comedyRecommendations
                                                        : videoGenre ===
                                                          "Education"
                                                        ? educationRecommendations
                                                        : videoGenre ===
                                                          "How-To"
                                                        ? howtoRecommendations
                                                        : 
*/
