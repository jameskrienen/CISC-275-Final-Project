import React, { useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Video } from "../Interfaces/VideoInterface";
import placeholderthumbnail from "../placeholder.jpeg";

export function CentralItemList({
    allVideos
}: {
    allVideos: Video[];
}): JSX.Element {
    const [videos, setVideos] = useState<Video[]>(allVideos);

    /*const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.VIDEO,
        collect: (monitor) => ({ isDragging: !!monitor.isDragging() })
    }));
    const [collectVideos, drop] = useDrop(() => ({ accept: ItemTypes.VIDEO }));*/

    function updateLikes(title: string) {
        setVideos(
            videos.map((video: Video) =>
                video.name === title
                    ? { ...video, likes: video.likes + 1 }
                    : video
            )
        );
    }

    function updateReported(title: string) {
        setVideos(
            videos.map((video: Video) =>
                video.name === title
                    ? { ...video, isReported: !video.isReported }
                    : video
            )
        );
    }

    function updateReccomendedView(title: string) {
        setVideos(
            videos.map((video: Video) =>
                video.name === title
                    ? { ...video, wantRecconmended: !video.wantRecconmended }
                    : video
            )
        );
    }

    return (
        <div>
            <Row>
                <Col style={{ columnCount: 3 }}>
                    {videos.map((video: Video) => (
                        <ul key={video.name} style={{ breakInside: "avoid" }}>
                            <h5>{video.name}</h5>
                            <div>
                                <span
                                    style={{
                                        fontWeight: "bold"
                                    }}
                                >
                                    Description:{" "}
                                </span>
                                <span>{video.description}</span>
                            </div>
                            <div>
                                <span style={{ fontWeight: "bold" }}>
                                    Genre:{" "}
                                </span>
                                <span>{video.genre}</span>
                            </div>
                            <img
                                src={placeholderthumbnail}
                                alt={video.name}
                            ></img>
                            <div style={{ marginTop: "10px" }}>
                                <span style={{ marginRight: "10px" }}>
                                    <Button
                                        onClick={() =>
                                            updateReported(video.name)
                                        }
                                    >
                                        Report{" "}
                                        {video.isReported === true ? "🚩" : " "}
                                    </Button>
                                </span>
                                <span>
                                    <Button
                                        onClick={() => updateLikes(video.name)}
                                    >
                                        👍
                                    </Button>
                                    {video.likes}
                                </span>
                                <span style={{ marginLeft: "10px" }}>
                                    <Button
                                        onClick={() =>
                                            updateReccomendedView(video.name)
                                        }
                                    >
                                        Reccomended
                                    </Button>
                                    {video.wantRecconmended === true ? (
                                        <span>
                                            <li>{video.recommended[0]}</li>
                                            <li>{video.recommended[1]}</li>
                                            <li>{video.recommended[2]}</li>
                                            <li>{video.recommended[3]}</li>
                                        </span>
                                    ) : (
                                        <span> </span>
                                    )}
                                </span>
                            </div>
                        </ul>
                    ))}
                </Col>
            </Row>
        </div>
    );
}
