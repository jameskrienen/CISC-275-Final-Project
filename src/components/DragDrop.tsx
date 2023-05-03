import React, { useState } from "react";
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

function DragDrop({ role }: { role: string }): JSX.Element {
    //const users = ["Dan", "Jess", "James"];
    const creators = ["Dan", "Jess", "James"];
    const moderators = ["Dan", "Jess", "James"];
    const [currentModerator, setCurrentModerator] = useState<Moderator>({
        review_list: []
    });
    const [currentCreator, setCurrentCreator] = useState<Creator>({
        username: "Dan",
        createdVideos: [],
        flaggedVideos: [],
        blockedUsers: []
    });

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
        const newCreator = {
            ...currentCreator,
            createdVideos: [...currentCreator.createdVideos, newVideo]
        };
        setCurrentCreator(newCreator);
        addVideoToCentralList(newVideo);
    }

    function updateModeratorVideos(newVideo: Video) {
        let newModerator: Moderator = currentModerator;
        if (!currentModerator.review_list.includes(newVideo)) {
            newModerator = {
                ...currentModerator,
                review_list: [...currentModerator.review_list, newVideo]
            };
        }
        setCurrentModerator(newModerator);
    }

    const [currentUser, setCurrentUser] = useState<string>("Dan");
    const [allVideos, setAllVideos] = useState<Video[]>(VIDEOS);
    const [watchList, setWatchList] = useState<Video[]>([]);
    //const [moderatorList, setModeratorList] = useState<Video[]>([]);
    //const [creatorList, setCreatorList] = useState<Video[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "VIDEO",
        drop: (item: Video) => addVideoToWatchlist(item.name),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }));

    function addVideoToCentralList(video: Video) {
        const newVideos = [...allVideos, video];
        setAllVideos(newVideos);
    }
    function updateCentralList(toEdit: Video) {
        const newVideos = allVideos.map((video: Video) => {
            return video.name === toEdit.name ? { ...toEdit } : video;
        });
        setAllVideos(newVideos);
    }

    function addVideoToWatchlist(name: string) {
        const videoToAdd = VIDEOS.filter((video: Video) => name === video.name);
        setWatchList((watchList) => [...watchList, videoToAdd[0]]);
    }

    function updateUser(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentUser(event.target.value);
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
                        <Row>
                            <Col style={{ columnCount: 3 }}>
                                {allVideos.map((video: Video) => {
                                    return (
                                        <ul
                                            key={video.name}
                                            style={{ breakInside: "avoid" }}
                                        >
                                            <VideoComponent
                                                key={`${video.likes}-${video.isReported}-${video.wantRecommended}`}
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
                                                updateCentralList={
                                                    updateCentralList
                                                }
                                                updateModeratorList={
                                                    updateModeratorVideos
                                                }
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
                                </div>
                                {watchList.map((video: Video) => {
                                    return (
                                        <div key="viewer">
                                            <VideoComponent
                                                key={`${video.likes}-${video.isReported}-${video.wantRecommended}`}
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
                                                updateCentralList={
                                                    updateCentralList
                                                }
                                                updateModeratorList={
                                                    updateModeratorVideos
                                                }
                                            ></VideoComponent>
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
                                        value={currentUser}
                                        onChange={updateUser}
                                    ></Form.Control>
                                    <Form.Label>
                                        {moderators.includes(currentUser)
                                            ? "Welcome "
                                            : ""}
                                        {moderators.includes(currentUser)
                                            ? currentUser
                                            : "Not a creator"}
                                        {"!"}
                                    </Form.Label>
                                </Form.Group>
                            </div>
                            <div>
                                {currentModerator.review_list.map(
                                    (video: Video) => {
                                        return (
                                            <div key="moderator">
                                                <VideoComponent
                                                    key={`${video.likes}-${video.isReported}-${video.wantRecommended}`}
                                                    name={video.name}
                                                    description={
                                                        video.description
                                                    }
                                                    genre={video.genre}
                                                    recommended={
                                                        video.recommended
                                                    }
                                                    isReported={
                                                        video.isReported
                                                    }
                                                    thumbnail={video.thumbnail}
                                                    wantRecommended={
                                                        video.wantRecommended
                                                    }
                                                    likes={video.likes}
                                                    updateCentralList={
                                                        updateCentralList
                                                    }
                                                    updateModeratorList={
                                                        updateModeratorVideos
                                                    }
                                                ></VideoComponent>
                                            </div>
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
                                value={currentUser}
                                onChange={updateUser}
                            ></Form.Control>
                            <Form.Label>
                                {creators.includes(currentUser)
                                    ? "Welcome "
                                    : ""}
                                {creators.includes(currentUser)
                                    ? currentUser
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
                                        <div key="creator">
                                            <VideoComponent
                                                key={`${video.likes}-${video.isReported}-${video.wantRecommended}`}
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
                                                updateCentralList={
                                                    updateCentralList
                                                }
                                                updateModeratorList={
                                                    updateModeratorVideos
                                                }
                                            ></VideoComponent>
                                        </div>
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
                            {uploadMode === true ? (
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
                                        onClick={() =>
                                            updateCreatorVideos({
                                                name: videoName,
                                                description: videoDescription,
                                                genre: videoGenre,
                                                recommended: [],
                                                isReported: false,
                                                thumbnail: placeholderimage,
                                                wantRecommended: false,
                                                likes: 0
                                            })
                                        }
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
