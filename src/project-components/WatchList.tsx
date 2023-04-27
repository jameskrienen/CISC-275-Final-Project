import React, { useState } from "react";
import { Video } from "../Interfaces/VideoInterface";
import placeholderthumbnail from "./placeholder.jpeg";
import { Row, Col, Button } from "react-bootstrap";

export function WatchList({
    userVideos
}: {
    userVideos: Video[];
}): JSX.Element {
    const [watchList, setWatchList] = useState<Video[]>(userVideos);

    return (
        <div>
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
                                onClick={() => setWatchList(userVideos)}
                            ></Button>
                        </ul>
                    ))}
                    ;
                </Col>
            </Row>
        </div>
    );
}
