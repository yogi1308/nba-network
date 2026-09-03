import Graph from "graphology";
import Sigma from "sigma";

const graph = new Graph();

const res = await fetch("/data/network.json");
const data = await res.json();
graph.import(data);

const degrees = graph.nodes().map(n => graph.degree(n));
const minDeg = Math.min(...degrees);
const maxDeg = Math.max(...degrees);

function scaleSize(deg, minOut = 3, maxOut = 25) {
  const t = (deg - minDeg) / (maxDeg - minDeg);
  return minOut + t * (maxOut - minOut);
}

const container = document.getElementById("app");
new Sigma(graph, container, {
  nodeReducer: (node, data) => ({
    ...data,
    size: scaleSize(graph.degree(node)),
  }),
});
