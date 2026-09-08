import { useEffect, useRef } from "react";
import Sigma from "sigma";
import { graph, scaleSize, visibleNodesAndEdges, pathFinder } from "./engine.js";
import { drawDiscNodeHover } from "sigma/rendering";
import { useStore } from "../store.js";

export default function SigmaCanvas({ leftPanelOpen }) {
    const selectedPlayer = useStore((s) => s.selectedPlayer);
    const player1 = useStore((s) => s.player1);
    const player2 = useStore((s) => s.player2);
    const depth = useStore((s) => s.depth);
    const showEdges = useStore((s) => s.showEdges);
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

    function computeView(params) {
        if (view === "path" && player1 !== null && player2 !== null) { 
            let { nodes, edges } = pathFinder(player1, player2);
           if (path === "all") {
               nodes = 
               edges = 
                   return {nodes: nodes, edges: edges}
           }
            else {

            }
        }
        return visibleNodesAndEdges(selectedPlayer, showEdges, depth);

        
    }

    useEffect(() => {
      setRef.current = computeView()
    }, [sigma, selectedPlayer, showEdges, depth])
    

    useEffect(() => {
        setRef.current = visibleNodesAndEdges(selectedPlayer, showEdges, depth);
        sigmaRef.current?.refresh();
    }, [depth, selectedPlayer, showEdges, sigma]);

    useEffect(() => {
        if (player1 === null || player2 === null) return
      setRef.current = pathFinder(player1, player2) 
        sigmaRef.current?.refresh();
    }, [player1, player2])
    

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
