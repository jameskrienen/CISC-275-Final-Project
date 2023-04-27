import React, { useState } from "react";
import "./App.css";
import { CentralItemList } from "./project-components/CentralItemList";
import { ReviewList } from "./project-components/ReviewList";
import { Form } from "react-bootstrap";
import { CreatorList } from "./project-components/CreatorList";
import { WatchList } from "./project-components/WatchList";
import { VIDEOS } from "./project-components/allVideos";

export const ItemTypes = {
    VIDEO: "video"
};

function App(): JSX.Element {
    //For user roles
    const [role, setRole] = useState<string>("viewer");

    function updateRole(event: React.ChangeEvent<HTMLSelectElement>) {
        setRole(event.target.value);
    }

    return (
        <div className="App">
            {/**App Logo and Role Choice*/}
            <div className="App-Logo">
                <span>
                    <img
                        src={require("./video-camera.png")}
                        alt="video camera website logo"
                        height={50}
                    ></img>
                </span>
                <span>Clipped!</span>
                <span>
                    <Form.Group controlId="userRoles">
                        <Form.Label>Choose your role:</Form.Label>
                        <Form.Select value={role} onChange={updateRole}>
                            <option value="viewer">Viewer</option>
                            <option value="creator">Creator</option>
                            <option value="moderator">Moderator</option>
                        </Form.Select>
                    </Form.Group>
                </span>
            </div>
            {/**Current view: moderator, creator, viewer -- default is viewer */}
            <div
                className="reviewList"
                hidden={role !== "moderator"}
                style={{ display: "flex", textAlign: "center" }}
            >
                <h2>Under Review:</h2>
                <ReviewList></ReviewList>
            </div>
            <div
                className="videoList"
                hidden={role === "creator" || role === "moderator"}
            >
                <h2>Videos:</h2>
                <CentralItemList allVideos={VIDEOS}></CentralItemList>
            </div>
            <div style={{ marginRight: 150, marginTop: 50 }}>
                <h2 hidden={role !== "viewer"}>Watchlist:</h2>
                <div hidden={role !== "viewer"}>
                    <WatchList userVideos={[]}></WatchList>
                </div>
            </div>
            <div hidden={role !== "creator"}>
                <CreatorList></CreatorList>
            </div>
        </div>
    );
}
export default App;
