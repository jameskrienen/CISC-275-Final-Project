import React, { useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Video } from "../Interfaces/VideoInterface";
import placeholderthumbnail from "./placeholder.jpeg";

const VIDEOS1: Video[] = [
    {
        name: "The Best Pop Songs from the 2000's",
        description: "Description here",
        genre: "Music",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "My Favorite Rock and Roll Playlist",
        description: "Description here",
        genre: "Music",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Who Deserves Album of the Year in 2023?",
        description: "Description here",
        genre: "Music",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Top 10 Artists You’ve Never Heard Of",
        description: "Description here",
        genre: "Music",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Why Drake is Overrated",
        description: "Description here",
        genre: "Music",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "A Look at the New GTA V Update",
        description: "Description here",
        genre: "Gaming",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "My Best Call of Duty Edit",
        description: "Description here",
        genre: "Gaming",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "This is the Best Minecraft Minigame",
        description: "Description here",
        genre: "Gaming",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Fortnite Pro Tournament Highlights",
        description: "Description here",
        genre: "Gaming",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Unboxing My New Xbox",
        description: "Description here",
        genre: "Gaming",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Mets vs Marlins Highlights",
        description: "Description here",
        genre: "Sports",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Steelers 2023 Season Predictions",
        description: "Description here",
        genre: "Sports",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Pros and Cons the New MLB Rules",
        description: "Description here",
        genre: "Sports",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "How Jon Rahm Won the Masters Tournament",
        description: "Description here",
        genre: "Sports",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Day in the Life of a D1 Athlete",
        description: "Description here",
        genre: "Sports",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    }
];

const VIDEOS2: Video[] = [
    {
        name: "Funny Standup Compilation",
        description: "Description here",
        genre: "Comedy",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Impractical Jokers Compilation",
        description: "Description here",
        genre: "Comedy",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "The Office Best Moments",
        description: "Description here",
        genre: "Comedy",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Try Not to Laugh",
        description: "Description here",
        genre: "Comedy",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Kevin Hart Best Jokes",
        description: "Description here",
        genre: "Comedy",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Learn Data Structures in 10 Minutes",
        description: "Description here",
        genre: "Education",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Learn Algorithms in 10 minutes",
        description: "Description here",
        genre: "Education",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Beginners Guide to Integrals",
        description: "Description here",
        genre: "Education",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "How AI Works",
        description: "Description here",
        genre: "Education",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "Intro to Biology",
        description: "Description here",
        genre: "Education",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "How to Ace a Whiteboard Interview",
        description: "Description here",
        genre: "How-To",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "How to Tie a Tie",
        description: "Description here",
        genre: "How-To",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "How to Write a Better Essay",
        description: "Description here",
        genre: "How-To",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "How to Pick a Lock",
        description: "Description here",
        genre: "How-To",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    },
    {
        name: "How to Cook a Great Steak",
        description: "Description here",
        genre: "How-To",
        recommended: [""],
        isReported: false,
        thumbnail: placeholderthumbnail,
        isLiked: false,
        likes: 0
    }
];

export function CentralItemList(): JSX.Element {
    const [allVideos1, setAllVideos1] = useState<Video[]>(VIDEOS1);
    const [allVideos2, setAllVideos2] = useState<Video[]>(VIDEOS2);

    const [liked1, setLiked1] = useState<boolean>(false);

    //function updateLiked1(video: Video) {}

    return (
        <div>
            <Row>
                <Col>
                    <ul>
                        {allVideos1.map((video: Video) => (
                            <li key={video.name}>
                                <img
                                    src={placeholderthumbnail}
                                    alt={video.name}
                                ></img>
                                <div>
                                    <span style={{ marginLeft: "200px" }}>
                                        <Button>Like</Button>
                                        {video.likes}
                                    </span>
                                </div>
                                <h5>{video.name}</h5>
                                <div>Description: {video.description}</div>
                                Genre: {video.genre}
                            </li>
                        ))}
                    </ul>
                </Col>
                <Col>
                    <ul>
                        {allVideos2.map((video: Video) => (
                            <li key={video.name}>
                                <img
                                    src={placeholderthumbnail}
                                    alt={video.name}
                                ></img>
                                <div>
                                    <span style={{ marginLeft: "200px" }}>
                                        <Button>Like</Button>
                                        {video.likes}
                                    </span>
                                </div>
                                <h5>{video.name}</h5>
                                <div>Description: {video.description}</div>
                                Genre: {video.genre}
                            </li>
                        ))}
                    </ul>
                </Col>
                <Col>
                    <h4>Viewer List:</h4>
                </Col>
            </Row>
        </div>
    );
}
