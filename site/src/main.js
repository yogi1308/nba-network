let selectedPlayer = null;
import Graph from "graphology";
import Sigma from "sigma";
import { drawDiscNodeHover } from "sigma/rendering";

const graph = new Graph();

const res = await fetch("/data/network.json");
const data = await res.json();
graph.import(data);

const degrees = graph.nodes().map((n) => graph.degree(n));
const minDeg = Math.min(...degrees);
const maxDeg = Math.max(...degrees);

function scaleSize(deg, minOut = 3, maxOut = 25) {
    const t = (deg - minDeg) / (maxDeg - minDeg);
    return minOut + t * (maxOut - minOut);
}

const container = document.getElementById("app");
new Sigma(graph, container, {
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
        if (selectedPlayer === null) {
            return { ...data, color: "#000000" };
        }
    },
});
