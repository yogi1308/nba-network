import { useEffect, useRef, useState } from "react";
import Sigma from "sigma";
import {
    graph,
    scaleSize,
    visibleNodesAndEdges,
    pathFinder,
    sliceLayers,
    getPaths,
    pathFinderSetDistance,
} from "./engine.js";
import { drawDiscNodeHover } from "sigma/rendering";
import { useStore } from "../store.js";

export default function SigmaCanvas({ leftPanelOpen }) {
    const [sP, setSP] = useState(null);
    const [p1, setP1] = useState(null);
    const [p2, setP2] = useState(null);
    const [pType, setPType] = useState(null);
    const [minD, setMinD] = useState(0)
    const [low, setlow] = useState(0)
    const [high, sethigh] = useState(0)
    const selectedPlayer = useStore((s) => s.selectedPlayer);
    const player1 = useStore((s) => s.player1);
    const player2 = useStore((s) => s.player2);
    const depth = useStore((s) => s.depth);
    const sigma = useStore((s) => s.sigma);
    const view = useStore((s) => s.view);
    const path = useStore((s) => s.path);
    const pathIndex = useStore((s) => s.pathIndex);
    const minPathIndex = useStore((s) => s.minPathIndex);
    const rangePathIndex = useStore((s) => s.rangePathIndex);
    const pathRangeLow = useStore((s) => s.pathRangeLow);
    const pathRangeHigh = useStore((s) => s.pathRangeHigh);
    const minPathDistance = useStore((s) => s.minPathDistance);
    const numMinPaths = useStore((s) => s.numMinPaths);
    const numRangePaths = useStore((s) => s.numRangePaths);
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
            // this runs even when switched from alt to all
            if (p1 !== player1 || p2 !== player2 || low !== pathRangeLow || high !== pathRangeHigh || minD !== minPathDistance) {
                if (path === "alt" || path === "all") {
                    pathFinder(player1, player2);
                } else if (path === "minLengthPathAlt" || path === "minLengthPathAll") {
                    pathFinderSetDistance(
                        player1,
                        player2,
                        minPathDistance,
                        minPathDistance,
                        "pathSetCache",
                    );
                } else if (path === "pathRangeAlt" || path === "pathRangeAll") {
                    pathFinderSetDistance(
                        player1,
                        player2,
                        pathRangeLow,
                        pathRangeHigh,
                        "pathRangeCache",
                    );
                }
                setPType(path);
                setP1(player1);
                setP2(player2);
                setlow(pathRangeLow)
                sethigh(pathRangeHigh)
                setMinD(minPathDistance)
            }
            if (path === "all") {
                return getPaths("all", "pathCache");
            } else if (path === "alt") {
                let res = getPaths(pathIndex, "pathCache");
                useStore.getState().setPathNodes(res.nodes);
                return res;
            } else if (path === "minLengthPathAlt") {
                let idx = minPathIndex < numMinPaths ? minPathIndex : 0;
                if (idx !== minPathIndex) useStore.getState().setMinPathIndex(0);
                let res = getPaths(idx, "pathSetCache");
                useStore.getState().setPathNodes(res.nodes);
                return res;
            } else if (path === "minLengthPathAll") {
                return getPaths("all", "pathSetCache");
            } else if (path === "pathRangeAll") {
                if (pathRangeLow !== "" && pathRangeHigh !== "") {
                    let res = getPaths("all", "pathRangeCache");
                    useStore.getState().setPathNodes(res.nodes);
                    return res;
                }
            } else if (path === "pathRangeAlt") {
                if (pathRangeLow !== "" && pathRangeHigh !== "") {
                    let idx = rangePathIndex < numRangePaths ? rangePathIndex : 0;
                    if (idx !== rangePathIndex) useStore.getState().setRangePathIndex(0);
                    let res = getPaths(idx, "pathRangeCache");
                    useStore.getState().setPathNodes(res.nodes);
                    return res;
                }
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
    }, [sigma, selectedPlayer, depth, path, player1, player2, view, pathIndex, minPathIndex, rangePathIndex, minPathDistance, pathRangeLow, pathRangeHigh]);

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
