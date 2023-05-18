import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { Video } from "./interfaces/VideoInterface";
import placeholderimage from "./placeholder.jpeg";

import { VIDEOS } from "./components/allVideos";
import userEvent from "@testing-library/user-event";

const sampleVideo: Video = {
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
describe("Test lists are rendered in some way", () => {
    beforeEach(() => {
        render(<App />);
    });
    test("renders the logo somewhere", () => {
        const linkElement = screen.getByText(/Clipped!/i);
        const logo = screen.getByAltText("video camera website logo");
        expect(linkElement).toBeInTheDocument();
        expect(logo).toBeInTheDocument();
    });

    test("check filter a to z", () => {
        const button = screen.getByTestId("A-Z");
        expect(button).toBeInTheDocument();
    });

    test("check filter by genre", () => {
        const button = screen.getByTestId("by genre");
        expect(button).toBeInTheDocument();
    });

    test("check clear watchlist", () => {
        const button = screen.getByTestId("clear watchlist");
        expect(button).toBeInTheDocument();
    });

    test("renders the central item list", () => {
        const list = screen.getByTestId("central item list");
        expect(list).toBeInTheDocument();
    });

    test("renders the watchlist list", () => {
        const list = screen.getByTestId("user watchlist");
        expect(list).toBeInTheDocument();
    });

    test("renders the watchlist list", () => {
        const list = screen.getByTestId("user watchlist");
        expect(list).toBeInTheDocument();
    });

    test("renders the moderator list", () => {
        const list = screen.getByTestId("moderator list");
        expect(list).toBeInTheDocument();
    });

    test("renders the creator list", () => {
        const list = screen.getByTestId("creator list");
        expect(list).toBeInTheDocument();
    });
    test("Role Selector Inital Value", () => {
        expect(screen.getByTestId("role-selector")).toBeInTheDocument();
    });

    test("Role selector form", () => {
        expect(screen.getByTestId("role-selector")).toHaveDisplayValue(
            "Viewer"
        );
    });
    test("Renders the Website Name", () => {
        expect(screen.getByText(/Clipped!/i)).toBeInTheDocument();
    });
});

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
});
