import Graph from "graphology";
import Sigma from "sigma";

const graph = new Graph();

const res = await fetch("/data/network.json");
const data = await res.json();
graph.import(data);

const container = document.getElementById("app");
new Sigma(graph, container);
