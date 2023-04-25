import React, { useState } from "react";
import { Video } from "../Interfaces/VideoInterface";
import { Row, Col, Button } from "react-bootstrap";
import placeholderthumbnail from "./placeholder.jpeg";

export function ReviewList(): JSX.Element {
    const [flaggedVideos, setFlaggedVideos] = useState<Video[]>([]);

    function initializeFlagged() {
        setFlaggedVideos(
            flaggedVideos.filter((video: Video) => video.isReported === true)
        );
    }
    function updateFlagged(title: string) {
        flaggedVideos.map((video: Video) =>
            video.name === title
                ? { ...video, isReported: !video.isReported }
                : video
        );
    }

    function updateAndSetFlagged(videos: Video[], title: string) {
        updateFlagged(title);
        initializeFlagged();
    }

    return (
        <div>
            <div>
                <h1>Under Review:</h1>
            </div>
            <Row>
                <Col style={{ columnCount: 2 }}>
                    {flaggedVideos.map((video: Video) => (
                        <ul key={video.name} style={{ breakInside: "avoid" }}>
                            <h5>{video.name}</h5>
                            <div>Description: {video.description}</div>
                            Genre: {video.genre}
                            <img
                                src={placeholderthumbnail}
                                alt={video.name}
                            ></img>
                            <div>
                                <Button
                                    onClick={() =>
                                        updateAndSetFlagged(
                                            flaggedVideos,
                                            video.name
                                        )
                                    }
                                >
                                    Unflag
                                </Button>
                            </div>
                        </ul>
                    ))}
                </Col>
            </Row>
        </div>
    );
}
