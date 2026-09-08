import { useStore } from "../src/store.js";
import { graph } from "../src/graph/engine.js";
import ArrowLeftSVG from "../assests/svg/ArrowLeftSVG.jsx";

export default function PathRes({ lPanelState }) {
    const pathNodes = useStore((s) => s.pathNodes);
    const player1 = useStore((s) => s.player1);
    const player2 = useStore((s) => s.player2);
    const numPaths = useStore((s) => s.numPaths);
    const minDistance = useStore((s) => s.minDistance);
    const nameOf = (id) => (id !== null ? graph.getNodeAttributes(id).label : "");
    return (
        <div
            className={` absolute z-1 top-1 ${lPanelState === "open" ? "left-84" : "left-8"} transition-all duration-300 ease-in`}
        >
            <p className="text-xl font-bold">
                Found {numPaths}{" "}
                {numPaths === 1
                    ? "shortest path of length"
                    : "shortest paths of length"}{" "}
                {minDistance} between {nameOf(player1)} and {nameOf(player2)}
            </p>
            <p className="text-xl font-bold">
                {[...pathNodes].reverse().map((id) => graph.getNodeAttributes(id).label).join(" > ")}
            </p>
        </div>
    );
}
