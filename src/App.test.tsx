import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("Renders the Website Name", () => {
    render(<App />);
    expect(screen.getByText(/Clipped!/i)).toBeInTheDocument();
});

test("Role Selector Inital Value", () => {
    render(<App />);
    expect(screen.getByTestId("role-selector")).toBeInTheDocument();
});
