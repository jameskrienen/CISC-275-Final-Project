import React from "react";
import { render, screen } from "@testing-library/react";
import DragDrop from "./DragDrop";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

describe("renders component correctly", () => {
    beforeEach(() => {
        render(
            <DndProvider backend={HTML5Backend}>
                <DragDrop role="viewer" />
            </DndProvider>
        );
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
});
