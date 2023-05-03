import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDrag } from "react-dnd";
import { Video } from "../interfaces/VideoInterface";
function VideoComponent({
    name,
    description,
    genre,
    recommended,
    isReported,
    thumbnail,
    wantRecommended,
    likes
}: {
    name: string;
    description: string;
    genre: string;
    recommended: string[];
    isReported: boolean;
    thumbnail: string;
    wantRecommended: boolean;
    likes: number;
}) {
    const [video, setVideo] = useState<Video>({name, description, genre, recommended, wantRecommended, isReported, thumbnail, likes})
    function updateLikes(count: number) {
        const newVideo = {...video, likes: count + 1};
        setVideo(newVideo);
    }
    function updateReccomendedView(newRecommended: boolean) {
        const newVideo = {...video, wantRecommended: !newRecommended};
        setVideo(newVideo);
    }
    function updateReported(newReported: boolean) {
        const newVideo = {...video, isReported: !newReported};
        setVideo(newVideo);
    }

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "VIDEO",
        item: { name: video.name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <div
            ref={drag}
            style={{
                border: isDragging ? "20px solid black" : "0px", paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, backgroundColor:"lightgray"
            }}
        >
            <h5>{video.name}</h5>
            <div>
                <span style={{fontWeight:"bold"}}>
                    Description:{" "}
                </span>
                <span>{video.description}</span>
            </div>
            <div>
                <span style={{fontWeight:"bold"}}>Genre:{" "}</span>
                <span>{video.genre}</span>
            </div>
            <img width={"200px"} src={video.thumbnail} alt={video.name}></img>
            <div style={{ marginTop: "10px" }}>
                <span style={{ marginRight: "10px" }}>
                    <Button
                        onClick={() =>
                            updateReported(video.isReported)
                        }
                        style={{backgroundColor:"#2a52be", color:"white", border:"2px solid black"}}
                    >
                        Report{" "}
                        {video.isReported === true ? "🚩" : " "}
                    </Button>
                </span>
                <span>
                    <Button
                        onClick={() => updateLikes(video.likes)}
                        style={{backgroundColor:"#2a52be", color:"white", border:"2px solid black"}}
                    >
                        👍
                    </Button>
                    {video.likes}
                </span>
                <span style={{ marginLeft: "10px" }}>
                    <Button
                        onClick={() =>
                            updateReccomendedView(video.wantRecommended)
                        }
                        style={{backgroundColor:"#2a52be", color:"white", border:"2px solid black"}}
                    >
                        Recommended
                    </Button>
                    {video.wantRecommended === true ?
                        <span>
                            <li>{video.recommended[0]}</li>
                            <li>{video.recommended[1]}</li>
                            <li>{video.recommended[2]}</li>
                            <li>{video.recommended[3]}</li>
                        </span> : <span/>}
                </span>
            </div>
        </div>
    );
}
export default VideoComponent;
