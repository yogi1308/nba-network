import Graph from "graphology";

const graph = new Graph();

const res = await fetch("/data/network.json");
const data = await res.json();
graph.import(data);

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

export function visibleNodesAndEdges(selected, showEdges, depth) {
    if (selected === null) {
        return showEdges
            ? { nodes: new Set(graph.nodes()), edges: new Set(graph.edges()) }
            : { nodes: new Set(graph.nodes()), edges: new Set() };
    }

    let nodes = new Set([selected]);
    let edges = new Set([]);
    let connected = new Set([selected]);
    if (showEdges && depth !== 0) {
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
                    let eds = graph.edges(nb);
                    for (const e of eds) {
                        const [s, t] = graph.extremities(e);
                        if (
                            (s === nb && !connected.has(t)) ||
                            (!connected.has(s) && t === nb)
                        ) {
                            edges.add(e);
                            connected.add(s);
                            connected.add(t);
                        }
                    }
                }
            }
        }
        prevNodes = curr;
    }
    if (!showEdges || depth === 0) return { nodes: nodes, edges: new Set() };

    return { nodes: nodes, edges: edges };
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
        if (distMap[n] === undefined || distMap[n] !== distMap[current] - 1) continue;;
        visited.add(n)
        path.push(n);
        dfs(distMap, target, n, path, maxDepth, currDepth + 1, visited, allPaths);
        path.pop();
        visited.delete(n);
    }
    return allPaths;
}

function pathFinderEdges(path) {
    let edges = new Set();
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
        edges.add(e);
    }
    return edges;
}
export function pathFinder(player1, player2) {
    if (player1 === null || player2 === null)
        return { nodes: new Set(), edges: new Set() };

    let q = [[player1, 0]];
    let found = false;
    let foundDepth = 0;
    let dist = { [ player1 ]: 0 };
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
        new Set([ player2 ]),
        [],
    );

    let edges = pathFinderEdges(path);

    console.log({ nodes: new Set(path), edges: edges });
    return { nodes: new Set(path), edges: edges };
}

export { graph };
