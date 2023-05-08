import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Video } from "../interfaces/VideoInterface";
import placeholderimage from "../placeholder.jpeg";
import { Creator } from "../interfaces/CreatorInterface";
import { VIDEOS } from "./allVideos";

export function CreatorList({
    currentCreator
}: {
    currentCreator: Creator;
}): JSX.Element {
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

    const [filterGenre, setFilterGenre] = useState<string>("");
    function updateFilterGenre(event: React.ChangeEvent<HTMLSelectElement>) {
        setFilterGenre(event.target.value);
    }

    const [creator, setCreator] = useState<string>(currentCreator.username);
    function updateCreator(event: React.ChangeEvent<HTMLInputElement>) {
        setCreator(event.target.value);
    }

    //const [allCreatedVids, setAllCreatedVids] = useState<Video[]>(VIDEOS);
    const [creatorVideos, setCreatorVideos] = useState<Video[]>([]);

    function updateCreatorVideos(newVideo: Video) {
        const newCreatorVideos = [...creatorVideos, newVideo];
        setCreatorVideos(newCreatorVideos);
    }

    /*
    function reorderByName() {
        VIDEOS.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
    */

    const userList: string[] = ["Dan", "James", "Jess"];

    //const [creatorVideos, setCreatorVideos] = useState<Video[]>([]);

    //uncomment these when implementing upload feature
    /*
    function updateCreatorVideos(newVideo: Video) {
        const newCreatorVideos = [...creatorVideos, newVideo];
        setCreatorVideos(newCreatorVideos);
    }
    */

    return (
        <div>
            <div>
                <h2>What is your username?</h2>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        value={creator}
                        onChange={updateCreator}
                    ></Form.Control>
                    <Form.Label>
                        {userList.includes(creator) ? "Welcome " : ""}
                        {userList.includes(creator) ? creator : "Not a creator"}
                        {"!"}
                    </Form.Label>
                </Form.Group>
            </div>
            <Row>
                <Col style={{ columnCount: 2 }}>
                    {creatorVideos.map((video: Video) => (
                        <ul key={video.name} style={{ breakInside: "avoid" }}>
                            <h5>{video.name}</h5>
                            <img src={placeholderimage} alt={video.name}></img>
                            <div>Description: {video.description}</div>
                            Genre: {video.genre}
                        </ul>
                    ))}
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
                <Col>
                    <h1>Filter videos</h1>
                    <div>
                        <Form.Group controlId="userEmotions">
                            <Form.Label>Filter</Form.Label>
                            <Form.Select
                                value={filterGenre}
                                onChange={updateFilterGenre}
                            >
                                <option value="Music">Music</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Sports">Sports</option>
                                <option value="Comedy">Comedy</option>
                                <option value="Education">Education</option>
                                <option value="How-To">How-To</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
