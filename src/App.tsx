import React from "react";
import "./App.css";
import { CentralItemList } from "./project-components/CentralItemList";

function App(): JSX.Element {
    return (
        <div className="App">
            <h1>CISC275 Final Project</h1>
            <h2>By Dan, Jess, and James</h2>
            <CentralItemList></CentralItemList>
        </div>
    );
}

export default App;
