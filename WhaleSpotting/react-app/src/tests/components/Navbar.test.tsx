import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../../components/Navbar";
import { BrowserRouter as Router } from "react-router-dom";

test("renders navbar", () => {
    render(<Router><Navbar /></Router>);
    const homeLink = screen.getByTestId("home-link-navbar");
    expect(homeLink).toBeInTheDocument(); 
});
