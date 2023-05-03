import React, { useState } from "react";
import { useDrop } from "react-dnd";
import "../App.css";
import VideoComponent from "./VideoComponent";
import { Video } from "../interfaces/VideoInterface";
import { VIDEOS } from "./allVideos";
import { Col, Form, Row } from "react-bootstrap";
import "./DragDrop.css";

function DragDrop({ role }: { role: string }): JSX.Element {
    const [allVideos, setAllVideos] = useState<Video[]>(VIDEOS);
    const [watchList, setWatchList] = useState<Video[]>([]);
    const [moderatorList, setModeratorList] = useState<Video[]>([]);
    const [creatorList, setCreatorList] = useState<Video[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "VIDEO",
        drop: (item: Video) => addVideo(item.name),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }));

    function updateCentralList(toEdit: Video) {
        const newVideos = allVideos.map((video: Video) => {
            return video.name === toEdit.name ? { ...toEdit } : video;
        });
        setAllVideos(newVideos);
    }

    function addVideo(name: string) {
        const videoToAdd = VIDEOS.filter((video: Video) => name === video.name);
        setWatchList((watchList) => [...watchList, videoToAdd[0]]);
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
                                                key={video.name}
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
                                                updateList={updateCentralList}
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
                                                key={video.name}
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
                                                updateList={updateCentralList}
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
                        <Col style={{ columnCount: 3 }}>
                            <div
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "xx-large"
                                }}
                            >
                                Review List:
                            </div>
                            {moderatorList.map((video: Video) => {
                                return (
                                    <div key="moderator">
                                        <VideoComponent
                                            key={video.name}
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
                                            updateList={updateCentralList}
                                        ></VideoComponent>
                                    </div>
                                );
                            })}
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
                            <Form.Control></Form.Control>
                        </Form.Group>
                    </span>
                    <span></span>
                    <Row>
                        <Col style={{ columnCount: 1, display: "flex" }}>
                            {creatorList.map((video: Video) => {
                                return (
                                    <div key="creator">
                                        <VideoComponent
                                            key={video.name}
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
                                            updateList={updateCentralList}
                                        ></VideoComponent>
                                    </div>
                                );
                            })}
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}
export default DragDrop;
