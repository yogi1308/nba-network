import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import Article from "./Article.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Article />
    </StrictMode>,
);