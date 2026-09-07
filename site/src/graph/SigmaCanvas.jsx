import { useEffect, useRef } from "react";
import Sigma from "sigma";
import { graph, scaleSize } from "./engine.js";
import { drawDiscNodeHover } from "sigma/rendering";
import { useStore } from "../store.js";

export default function SigmaCanvas({ leftPanelOpen }) {
    const containerRef = useRef(null);
    const sigmaRef = useRef(null);

    useEffect(() => {
        const sigma = new Sigma(graph, containerRef.current, {
            labelWeight: "bold",
            labelSize: 15,
            labelColor: { color: "#ffffff" },
            defaultDrawNodeHover: (context, data, settings) =>
                drawDiscNodeHover(context, data, {
                    ...settings,
                    labelColor: { color: "#000000" },
                }),
            nodeReducer: (node, data) => ({
                ...data,
                size: scaleSize(graph.degree(node)),
                color: "#c20f2d",
            }),
            edgeReducer: (edge, data) => {
                const { selectedPlayer } = useStore.getState();
                if (selectedPlayer === null) {
                    return { ...data, color: "#000000" };
                }
            },
        });
        sigmaRef.current = sigma;
        useStore.getState().setSigma(sigma);
        return () => {
            sigma.kill();
            useStore.getState().setSigma(null);
        };
    }, []);

    return (
        <div ref={containerRef} style={{ flex: 1, minWidth: 0, height: "100vh", margin: "0 0 0 0.5rem", border: leftPanelOpen ? "1px solid #262a30" : "none", borderRadius: "8px" }} />
    );
}
