import { connectedComponents } from "graphology-components";
import { graph, maxDegreePlayer } from "../src/graph/engine.js";
import { useStore } from "../src/store.js";
export default function Analysis() {
    useStore((s) => s.graphUpdated);
    const m = maxDegreePlayer();
    const nComponents = connectedComponents(graph).length;
    return (
        <div className="flex flex-col gap-1">
            <p className="text-xl font-bold">Analysis</p>
            <p>Total Players: {graph.nodes().length}</p>
            <p>Total Connections: {graph.edges().length}</p>
            <p>
                Average Degree:{" "}
                {((2 * graph.edges().length) / graph.nodes().length).toFixed(2)}
            </p>
            {m && (
                <p>
                    Most Teammates: {m.name} ({m.degree})
                </p>
            )}
            <p>Percentage of NBA History: </p>
            <p>{((graph.nodes().length / 5122) * 100).toFixed(2)}% of all players</p>
            <p>
                {((graph.edges().length / 164567) * 100).toFixed(2)}% of all connections
            </p>
            <p>Number of Components: {nComponents}</p>
            <p>More analysis and insights: Coming Soon...</p>
        </div>
    );
}
