import { useEffect, useRef } from "react";
import Sigma from "sigma";
import { graph, scaleSize } from "./engine.js";
import { drawDiscNodeHover } from "sigma/rendering";
import { useStore } from "../store.js";

export default function SigmaCanvas() {
    const containerRef = useRef(null);
    const sigmaRef = useRef(null);
    useEffect(() => {
        sigmaRef.current = new Sigma(graph, containerRef.current, {
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
        return () => sigmaRef.current.kill();
    }, []);
    return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}
