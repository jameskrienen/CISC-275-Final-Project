import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Video } from "../Interfaces/VideoInterface";
import placeholderthumbnail from "./placeholder.jpeg";

export function CreatorList(): JSX.Element {
    const creatorVideos: Video[] = [];
    const [creator, setCreator] = useState<string>("");
    //const [creatorVideos, setCreatorVideos] = useState<Video[]>([]);

    function updateCreator(event: React.ChangeEvent<HTMLInputElement>) {
        setCreator(event.target.value);
    }

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
                </Form.Group>
            </div>
            <Row>
                <Col style={{ columnCount: 2 }}>
                    {creatorVideos.map((video: Video) => (
                        <ul key={video.name} style={{ breakInside: "avoid" }}>
                            <h5>{video.name}</h5>
                            <div>Description: {video.description}</div>
                            Genre: {video.genre}
                            <img
                                src={placeholderthumbnail}
                                alt={video.name}
                            ></img>
                        </ul>
                    ))}
                </Col>
            </Row>
        </div>
    );
}
