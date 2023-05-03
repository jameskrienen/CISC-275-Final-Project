import React, { useState } from "react";
import { Video } from "../interfaces/VideoInterface";
import { Row, Col, Button } from "react-bootstrap";
import placeholderthumbnail from "../placeholder.jpeg";

export function ReviewList({ videoList }: { videoList: Video[] }): JSX.Element {
    const [flaggedVideos, setFlaggedVideos] = useState<Video[]>(videoList);

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

    return (
        <div>
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
                                    onClick={() => (
                                        updateFlagged(video.name),
                                        initializeFlagged()
                                    )}
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
