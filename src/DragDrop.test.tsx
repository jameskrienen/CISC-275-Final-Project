import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("A-Z Button Presence", () => {
    render(<App />);
    expect(screen.getByTestId("a-z_button")).toBeInTheDocument();
});

test("Genere Button Presence", () => {
    render(<App />);
    expect(screen.getByTestId("genere_button")).toBeInTheDocument();
});

test("Viewer list compenent", () => {
    render(<App />);
    expect(screen.getByTestId("viewer-component").toBeInTheDocument());
});
