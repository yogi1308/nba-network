import Graph from "graphology";
import { useStore } from "../store.js";

const graph = new Graph();

const res = await fetch("/data/network.json");
const data = await res.json();
graph.import(data);

export let layers = {};

const maxDepthMap = new Map(
    data.nodes.map((n) => [n.key, n.attributes.maxDepth]),
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

export function visibleNodesAndEdges(selected) {
    if (selected === null) {
        layers = { nodes: new Set(graph.nodes()), edges: new Set(graph.edges()) };
        return;
    }

    layers = { 0: { nodes: [selected], edges: [], cumulativeNodes: 1 } };
    let q = [[selected, 0]];
    let visited = new Set([selected]);
    let total = 1;
    while (q.length) {
        let [player, depth] = q.shift();
        for (const nb of graph.neighbors(player)) {
            if (visited.has(nb)) continue;
            q.push([nb, depth + 1]);
            visited.add(nb);
            if (depth + 1 in layers) {
                layers[depth + 1].nodes.push(nb);
            } else {
                layers[depth + 1] = { nodes: [nb], edges: [] };
            }
            layers[depth + 1].cumulativeNodes = ++total;
            for (const e of graph.edges(nb)) {
                const [s, t] = graph.extremities(e);
                if ((s === nb && t === player) || (s === player && t === nb)) {
                    layers[depth + 1].edges.push(e);
                }
            }
        }
    }
}

export function sliceLayers(depth) {
    if (!(0 in layers)) return layers;
    const nodes = new Set();
    const edges = new Set();
    for (let d = 0; d <= depth; d++) {
        for (const n of layers[d].nodes) nodes.add(n);
        for (const e of layers[d].edges) edges.add(e);
    }
    useStore.getState().setCumulativeNodes(layers[depth]?.cumulativeNodes);
    return { nodes, edges };
}

function dfs(
    distMap,
    target,
    current,
    path,
    maxDepth,
    currDepth,
    visited,
    allPaths,
) {
    if (current === target) {
        allPaths.push([...path]);
        return;
    }
    if (currDepth > maxDepth) {
        return;
    }
    let nb = graph.neighbors(current);
    for (const n of nb) {
        if (visited.has(n)) continue;
        if (distMap[n] === undefined || distMap[n] !== distMap[current] - 1)
            continue;
        visited.add(n);
        path.push(n);
        dfs(distMap, target, n, path, maxDepth, currDepth + 1, visited, allPaths);
        path.pop();
        visited.delete(n);
    }
    return allPaths;
}

function pathFinderEdges(path) {
    let edges = [];
    for (const p of path) {
        let e = [];
        for (let index = 1; index < p.length; index++) {
            for (const ed of graph.edges(p[index - 1])) {
                const [s, t] = graph.extremities(ed);
                if (
                    (s === p[index - 1] && t === p[index]) ||
                    (s === p[index] && t === p[index - 1])
                ) {
                    e.push(ed);
                }
            }
        }
        edges.push(e);
    }
    return edges;
}
export function pathFinder(player1, player2) {
    if (player1 === null || player2 === null) return { nodes: [], edges: [] };

    let q = [[player1, 0]];
    let found = false;
    let foundDepth = 0;
    let dist = { [player1]: 0 };
    while (q) {
        let player = q.shift();
        if (found && player[1] + 1 > foundDepth) break;
        for (const nb of graph.neighbors(player[0])) {
            if (nb in dist) continue;
            q.push([nb, player[1] + 1]);
            dist[nb] = player[1] + 1;

            if (nb === player2) {
                if (!found) foundDepth = player[1];
                found = true;
                break;
            }
        }
    }

    let path = dfs(
        dist,
        player1,
        player2,
        [player2],
        foundDepth,
        0,
        new Set([player2]),
        [],
    );

    let edges = pathFinderEdges(path);

    return { nodes: path, edges: edges };
}

export { graph };
