import { useEffect, useRef } from "react";
import Sigma from "sigma";
import { graph, scaleSize, visibleNodesAndEdges } from "./engine.js";
import { drawDiscNodeHover } from "sigma/rendering";
import { useStore } from "../store.js";

export default function SigmaCanvas({ leftPanelOpen }) {
    const selectedPlayer = useStore((s) => s.selectedPlayer);
    const depth = useStore((s) => s.depth);
    const showEdges = useStore((s) => s.showEdges);
    const sigma = useStore((s) => s.sigma);
    const containerRef = useRef(null);
    const sigmaRef = useRef(null);
    const setRef = useRef(null);

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
            nodeReducer: (node, data) => {
                const { nodes } = setRef.current ?? { nodes: new Set() };
                return {
                    ...data,
                    size: scaleSize(graph.degree(node)),
                    color: "#c20f2d",
                    hidden: !nodes.has(node),
                };
            },
            edgeReducer: (edge, data) => {
                const { edges } = setRef.current ?? { edges: new Set() };
                return {
                    ...data,
                    color: "#1c3f87", 
                    hidden: !edges.has(edge)
                };
            },
        });
        sigmaRef.current = sigma;
        useStore.getState().setSigma(sigma);
        return () => {
            sigma.kill();
            useStore.getState().setSigma(null);
        };
    }, []);

    useEffect(() => {
        setRef.current = visibleNodesAndEdges(selectedPlayer, showEdges, depth);
        sigmaRef.current?.refresh();
    }, [depth, selectedPlayer, showEdges, sigma]);

    return (
        <div
            ref={containerRef}
            style={{
                flex: 1,
                minWidth: 0,
                height: "100vh",
                margin: "0 0 0 0.5rem",
                border: leftPanelOpen ? "1px solid #262a30" : "none",
                borderRadius: "8px",
            }}
        />
    );
}
