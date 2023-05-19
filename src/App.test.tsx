import React from "react";
import { act, render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

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

    test("renders DragDrop component", () => {
        expect(screen.getByTestId("drag-n-drop")).toBeInTheDocument();
    });
});

describe("updates roles correctly", () => {
    beforeEach(() => {
        render(<App />);
    });

    test("role can be updated to moderator", () => {
        const select = screen.getByTestId("role-selector");
        act(() => {
            userEvent.selectOptions(select, "moderator");
        });
        expect(screen.getByText("Moderator")).toBeInTheDocument();
    });

    test("role can be updated to creator", () => {
        const select = screen.getByTestId("role-selector");
        act(() => {
            userEvent.selectOptions(select, "creator");
        });
        expect(screen.getByText("Creator")).toBeInTheDocument();
    });

    test("role can be updated back to viewer", () => {
        const select = screen.getByTestId("role-selector");
        act(() => {
            userEvent.selectOptions(select, "creator");
        });
        expect(screen.getByText("Creator")).toBeInTheDocument();
        act(() => {
            userEvent.selectOptions(select, "viewer");
        });
        expect(screen.getByText("Viewer")).toBeInTheDocument();
    });
});
