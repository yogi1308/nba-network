import Graph from "graphology";

const graph = new Graph();

const res = await fetch("/data/network.json");
const data = await res.json();
graph.import(data);

const maxDepthMap = new Map(
    data.nodes.map((n) => [n.key, n.attributes.maxDepth])
);

export function maxDepthOf(key) {
    return maxDepthMap.get(key) ?? 9;
}

const degrees = graph.nodes().map((n) => graph.degree(n));
const minDeg = Math.min(...degrees);
const maxDeg = Math.max(...degrees);

export function scaleSize(deg, minOut = 3, maxOut = 25) {
    const t = (deg - minDeg) / (maxDeg - minDeg);
    return minOut + t * (maxOut - minOut);
}

export function visibleNodesAndEdges(selected, showEdges, depth) {
    if (selected === null) {
        return showEdges
            ? { nodes: new Set(graph.nodes()), edges: new Set(graph.edges()) }
            : { nodes: new Set(graph.nodes()), edges: new Set() };
    }

    let nodes = new Set([selected]);
    let edges = new Set([]);
    let connected = new Set([selected]);
    if (showEdges) {
        for (const e of graph.edges(selected)) {
            edges.add(e);
            const [s, t] = graph.extremities(e);
            connected.add(s);
            connected.add(t);
        }
    }

    let prevNodes = new Set([selected]);
    for (let currDepth = 0; currDepth < depth; currDepth++) {
        let curr = new Set();
        for (const n of prevNodes) {
            for (const nb of graph.neighbors(n)) {
                if (nodes.has(nb)) continue;
                curr.add(nb);
                nodes.add(nb);
                if (currDepth < depth - 1 && showEdges) {
                    let eds = graph.edges(nb)
                    for (const e of eds) {
                        const [s, t] = graph.extremities(e)
                        if (s === nb && !connected.has(t)) {
                            edges.add(e)
                        }
                    }
                }
            }
        }
        prevNodes = curr;
    }
    if (!showEdges) return { nodes: nodes, edges: new Set() };

    return { nodes: nodes, edges: edges };
}

export { graph };
