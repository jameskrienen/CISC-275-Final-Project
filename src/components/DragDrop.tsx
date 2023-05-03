import React, { useState } from "react";
import { useDrop } from "react-dnd";
import "../App.css";
import VideoComponent from "./VideoComponent";
import { Video } from "../interfaces/VideoInterface";
import { VIDEOS } from "./allVideos";
import { Col, Row } from "react-bootstrap";
import "./DragDrop.css"

function DragDrop(): JSX.Element {
    const [watchList, setWatchList] = useState<Video[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "VIDEO",
        drop: (item: Video) => addVideo(item.name),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }));

    function addVideo(name: string) {
        const videoToAdd = VIDEOS.filter((video: Video) => name === video.name);
        setWatchList((watchList) => [...watchList, videoToAdd[0]]);
    }

    return (
        <div className="lists">
            <div
                className="centralList"
            >
                <Row>
                    <Col style={{columnCount:2}}>
                        {VIDEOS.map((video: Video) => {
                            return (
                                <ul key={video.name} style={{ breakInside:"avoid"}}>
                                    <VideoComponent
                                        key={video.name}
                                        name={video.name}
                                        description={video.description}
                                        genre={video.genre}
                                        recommended={video.recommended}
                                        isReported={video.isReported}
                                        thumbnail={video.thumbnail}
                                        wantRecommended={video.wantRecommended}
                                        likes={video.likes}
                                    ></VideoComponent>
                                </ul>
                    );
                        })}
                    </Col>
                </Row>
            </div>
            <div
                className="watchList"
                ref={drop}
            >
               <Row>
                    <Col style={{columnCount:1}}>
                    <div style={{fontWeight:"bold", fontSize:"xx-large"}}>Watchlist:</div>
                        {watchList.map((video: Video) => {
                            return (
                                <div>
                                    <VideoComponent
                                        key={video.name}
                                        name={video.name}
                                        description={video.description}
                                        genre={video.genre}
                                        recommended={video.recommended}
                                        isReported={video.isReported}
                                        thumbnail={video.thumbnail}
                                        wantRecommended={video.wantRecommended}
                                        likes={video.likes}
                                    ></VideoComponent>
                                </div>
                    );
                        })}
                    </Col>
                </Row>
            </div>
        </div>
    );
}
export default DragDrop;
