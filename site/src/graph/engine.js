import Graph from "graphology";
import { useStore } from "../store.js";

const graph = new Graph();

const res = await fetch("/data/network.json");
const data = await res.json();
graph.import(data);

let layers = {};
let pathCache = {};
let pathSetCache = {};
let pathRangeCache = {};
const MAX_PATHS = 100;

export function maxDepthOf(key) {
    let depth = 0
    let q = [[key, 0]]
    let visited = new Set([key])
    while (q.length) {
        const [player, d] = q.shift()
        depth = Math.max(depth, d)
        for (const nb of graph.neighbors(player)) {
            if (visited.has(nb)) {
                continue    
            }
            visited.add(nb)
            q.push([nb, d + 1])
        }
    }
    return depth
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
    if (allPaths.length > 100) {return}
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
    if (player1 === null || player2 === null) {
        pathCache = { nodes: [], edges: [] };
        return;
    }
    let q = [[player1, 0]];
    let found = false;
    let foundDepth = 0;
    let dist = { [player1]: 0 };
    while (q) {
        let [player, depth] = q.shift();
        if (found && depth + 1 > foundDepth) break;
        for (const nb of graph.neighbors(player)) {
            if (nb in dist) continue;
            q.push([nb, depth + 1]);
            dist[nb] = depth + 1;

            if (nb === player2) {
                if (!found) foundDepth = depth;
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

    if (path.length === 0) {
        pathCache = { nodes: [], edges: [] };
        useStore.getState().setNumPaths(0);
        useStore.getState().setMinPathIndex(0);
        useStore.getState().setMinDistance(null);
        return;
    }

    let edges = pathFinderEdges(path);

    pathCache = { nodes: path, edges: edges };
    useStore.getState().setNumPaths(path.length);
    useStore.getState().setMinPathIndex(0);
    useStore.getState().setMinDistance(path[0].length - 1);
    return;
}

export function getPaths(pathIndex, cache) {
    if (pathIndex === "all" && cache === "pathCache") {
        return {
            nodes: new Set(pathCache.nodes.flat()),
            edges: new Set(pathCache.edges.flat()),
        };
    } else if (cache === "pathCache") {
        return {
            nodes: new Set(pathCache.nodes[pathIndex]),
            edges: new Set(pathCache.edges[pathIndex]),
        };
    }
    if (pathIndex === "all" && cache === "pathSetCache") {
        return {
            nodes: new Set(pathSetCache.nodes.flat()),
            edges: new Set(pathSetCache.edges.flat()),
        };
    } else if (cache === "pathSetCache") {
        return {
            nodes: new Set(pathSetCache.nodes[pathIndex]),
            edges: new Set(pathSetCache.edges[pathIndex]),
        };
    }
    if (pathIndex === "all" && cache === "pathRangeCache") {
        return {
            nodes: new Set(pathRangeCache.nodes.flat()),
            edges: new Set(pathRangeCache.edges.flat()),
        };
    } else if (cache === "pathRangeCache") {
        return {
            nodes: new Set(pathRangeCache.nodes[pathIndex]),
            edges: new Set(pathRangeCache.edges[pathIndex]),
        };
    }
}

function bfsDistancesFrom(target) {
    const dist = new Map([[target, 0]]);
    const q = [target];
    while (q.length) {
        const node = q.shift();
        const d = dist.get(node);
        for (const nb of graph.neighbors(node)) {
            if (dist.has(nb)) continue;
            dist.set(nb, d + 1);
            q.push(nb);
        }
    }
    return dist;
}

function dfsSetDistance(
    target,
    current,
    path,
    distFromTarget,
    visited,
    allPaths,
    minLength,
    maxLength,
) {
    if (allPaths.length >= MAX_PATHS) {return allPaths}
    if (
        current === target &&
        path.length - 1 >= minLength &&
        path.length - 1 <= maxLength
    ) {
        allPaths.push([...path]);
        return allPaths;
    }
    if (path.length - 1 >= maxLength || current === target) {
        return allPaths;
    }
    let nb = graph.neighbors(current);
    for (const n of nb) {
        if (visited.has(n)) continue;
        const d = distFromTarget.get(n);
        if (d === undefined) continue;
        if (path.length + d > Number(maxLength)) continue;
        visited.add(n);
        path.push(n);
        dfsSetDistance(
            target,
            n,
            path,
            distFromTarget,
            visited,
            allPaths,
            minLength,
            maxLength,
        );
        path.pop();
        visited.delete(n);
    }
    return allPaths;
}

export function pathFinderSetDistance(
    player1,
    player2,
    minLength,
    maxLength = 15,
    cache,
) {
    if (player1 === null || player2 === null) {
        pathCache = { nodes: [], edges: [] };
        return;
    }

    let distFromTarget = bfsDistancesFrom(player1);

    let path = dfsSetDistance(
        player1,
        player2,
        [player2],
        distFromTarget,
        new Set([player2]),
        [],
        minLength,
        maxLength,
    );

    let edges = pathFinderEdges(path);
    if (cache === "pathSetCache") {
        pathSetCache = { nodes: path, edges: edges };
        useStore.getState().setNumMinPaths(path.length);
        useStore.getState().setMinPathIndex(0);
    } else if (cache === "pathRangeCache") {
        pathRangeCache = { nodes: path, edges: edges };
        useStore.getState().setNumRangePaths(path.length);
        useStore.getState().setRangePathIndex(0);
    }

    return;
}

export { graph };
