import React, { useState } from "react";
import { Video } from "../Interfaces/VideoInterface";
import placeholderthumbnail from "../placeholder.jpeg";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Viewer } from "../Interfaces/ViewerInterface";

export function WatchList({
    currentUser
}: {
    currentUser: Viewer;
}): JSX.Element {
    const userList: string[] = ["Dan", "James", "Jess"];
    const [username, setUsername] = useState<string>(currentUser.username);
    const [watchList, setWatchList] = useState<Video[]>(currentUser.watchlist);

    function updateViewer(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

    return (
        <div>
            <div>
                <h2>What is your username?</h2>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        value={username}
                        onChange={updateViewer}
                    ></Form.Control>
                    <Form.Label>
                        {userList.includes(username) ? "Welcome " : ""}
                        {userList.includes(username) ? username : "Not a user"}
                        {"!"}
                    </Form.Label>
                </Form.Group>
            </div>
            <Row>
                <Col style={{ columnCount: 1 }}>
                    {watchList.map((video: Video) => (
                        <ul key={video.name} style={{ breakInside: "avoid" }}>
                            <h5>{video.name}</h5>
                            <div>Description: {video.description}</div>
                            Genre: {video.genre}
                            <img
                                src={placeholderthumbnail}
                                alt={video.name}
                            ></img>
                            <Button
                                onClick={() => setWatchList(watchList)}
                            ></Button>
                        </ul>
                    ))}
                </Col>
            </Row>
        </div>
    );
}
