import React, { useState } from "react";
import "./App.css";
import { CentralItemList } from "./project-components/CentralItemList";
import { ReviewList } from "./project-components/ReviewList";
import { Form } from "react-bootstrap";

function App(): JSX.Element {
    //For user roles
    const [role, setRole] = useState<string>("");
    function updateRole(event: React.ChangeEvent<HTMLSelectElement>) {
        setRole(event.target.value);
    }
    //Actual app
    return (
        <div className="App">
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
            <div
                hidden={role !== "moderator"}
                style={{ display: "flex", textAlign: "center" }}
            >
                <ReviewList></ReviewList>
            </div>
            <div className="videoList" hidden={role === "moderator"}>
                <h2>Videos:</h2>
                <CentralItemList></CentralItemList>
            </div>
        </div>
    );
}
export default App;
