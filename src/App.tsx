import React, { useState } from "react";
import "./App.css";
import { Form } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from "./components/DragDrop";

export const ItemTypes = {
    VIDEO: "video"
};

function App(): JSX.Element {
    const [role, setRole] = useState<string>("viewer");

    function updateRole(event: React.ChangeEvent<HTMLSelectElement>) {
        setRole(event.target.value);
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="App">
                <div className="App-Logo">
                    <span>
                        <img
                            src={require("./video-camera.png")}
                            alt="video camera website logo"
                            height={50}
                            style={{ marginTop: "50px", marginLeft: "20px" }}
                        ></img>
                    </span>
                    <span
                        style={{
                            fontSize: "xx-large",
                            fontWeight: "bolder",
                            marginLeft: "20px"
                        }}
                    >
                        Clipped!
                    </span>
                    <span>
                        <Form.Group
                            data-testid="role-selector"
                            controlId="userRoles"
                            style={{ marginTop: "100px", marginLeft: "30px" }}
                        >
                            <Form.Label
                                style={{
                                    fontSize: "large",
                                    fontWeight: "bold"
                                }}
                            >
                                Choose your role:
                            </Form.Label>
                            <Form.Select value={role} onChange={updateRole}>
                                <option value="viewer">Viewer</option>
                                <option value="creator">Creator</option>
                                <option value="moderator">Moderator</option>
                            </Form.Select>
                        </Form.Group>
                    </span>
                </div>
                <div className="lists">
                    <DragDrop role={role} />
                </div>
            </div>
        </DndProvider>
    );
}
export default App;
