import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
//import { Video } from "./interfaces/VideoInterface";
//import placeholderimage from "./placeholder.jpeg";

//import { VIDEOS } from "./components/allVideos";
//import userEvent from "@testing-library/user-event";

/*const sampleVideo: Video = {
    name: "Sample",
    description: "Sample description",
    genre: "Comedy",
    recommended: [],
    wantRecommended: false,
    isReported: false,
    thumbnail: placeholderimage,
    likes: 0,
    commentList: [],
    creator: "Clipped",
    wantToComment: false,
    dropdown: false
};
*/
describe("renders correctly", () => {
    beforeEach(() => {
        render(<App />);
    });
    test("renders the logo somewhere", () => {
        const linkElement = screen.getByText(/Clipped!/i);
        const logo = screen.getByAltText("video camera website logo");
        expect(linkElement).toBeInTheDocument();
        expect(logo).toBeInTheDocument();
    });

    test("role selector is initially set to viewer", () => {
        expect(screen.getByTestId("role-selector")).toHaveDisplayValue(
            "Viewer"
        );
    });
});
/*
describe("tests lists are updated properly", () => {
    beforeEach(() => {
        render(<App />);
    });
    test("uploading video adds to central list", () => {
        // check upload button
        userEvent.click(screen.getByTestId("upload-mode-check"));
        // type in a video name
        userEvent.type(screen.getByTestId("name-form"), "sample name");
        // type in a decsription
        userEvent.type(
            screen.getByTestId("desciption-form"),
            "sample description"
        );
        // check a genre
        userEvent.click(screen.getByLabelText("music-checkbox"));
        // upload the video
        userEvent.click(screen.getByText("Upload Video"));
        expect(screen.getByTestId("central item list")).toEqual([
            ...VIDEOS,
            sampleVideo
        ]);
    });
});*/
