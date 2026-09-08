import { useEffect, useRef, useState } from "react";
import Sigma from "sigma";
import {
    graph,
    scaleSize,
    visibleNodesAndEdges,
    pathFinder,
    sliceLayers,
    getPaths,
} from "./engine.js";
import { drawDiscNodeHover } from "sigma/rendering";
import { useStore } from "../store.js";

export default function SigmaCanvas({ leftPanelOpen }) {
    const [sP, setSP] = useState(null);
    const [p1, setP1] = useState(null);
    const [p2, setP2] = useState(null);
    const selectedPlayer = useStore((s) => s.selectedPlayer);
    const player1 = useStore((s) => s.player1);
    const player2 = useStore((s) => s.player2);
    const depth = useStore((s) => s.depth);
    const sigma = useStore((s) => s.sigma);
    const view = useStore((s) => s.view);
    const path = useStore((s) => s.path);
    const pathIndex = useStore((s) => s.pathIndex);
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
                    hidden: !edges.has(edge),
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

    function computeView() {
        if (view === "path" && player1 !== null && player2 !== null) {
            if (p1 !== player1 || p2 !== player2) {
                pathFinder(player1, player2);
                setP1(player1)
                setP2(player2)
            }
            if (path === "all") {
                return getPaths("all");
            } else {
                return getPaths(pathIndex)
            }
        }
        if (sP !== selectedPlayer || (sP === null && selectedPlayer === null)) {
            setSP(selectedPlayer);
            visibleNodesAndEdges(selectedPlayer);
        }
        return sliceLayers(depth);
    }

    useEffect(() => {
        setRef.current = computeView();
        sigmaRef.current?.refresh();
    }, [sigma, selectedPlayer, depth, path, player1, player2, view, pathIndex]);

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
