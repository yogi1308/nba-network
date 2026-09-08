import { useStore } from "../src/store.js";
import { graph } from "../src/graph/engine.js";

export default function PathRes({ lPanelState }) {
    const pathNodes = useStore((s) => s.pathNodes);
    const player1 = useStore((s) => s.player1);
    const player2 = useStore((s) => s.player2);
    const path = useStore((s) => s.path);
    const numPaths = useStore((s) => s.numPaths);
    const minDistance = useStore((s) => s.minDistance);
    const numMinPaths = useStore((s) => s.numMinPaths);
    const minPathDistance = useStore((s) => s.minPathDistance);
    const numRangePaths = useStore((s) => s.numRangePaths);
    const pathRangeLow = useStore((s) => s.pathRangeLow);
    const pathRangeHigh = useStore((s) => s.pathRangeHigh);
    const nameOf = (id) => (id !== null ? graph.getNodeAttributes(id).label : "");

    const isMin = path === "minLengthPathAlt" || path === "minLengthPathAll";
    const isRange = path === "pathRangeAlt" || path === "pathRangeAll";
    const isAll = path === "all" || path === "minLengthPathAll" || path === "pathRangeAll";

    const count = isRange ? numRangePaths : isMin ? numMinPaths : numPaths;
    const displayedCount = count >= 100 ? `at least ${count}` : count;
    const kind = isMin || isRange ? "" : "shortest ";
    const plural = count === 1 ? "path" : "paths";
    const length = isRange
        ? `${pathRangeLow} - ${pathRangeHigh}`
        : isMin
          ? minPathDistance
          : minDistance;

    return (
        <div
            className={` absolute z-1 top-1 ${lPanelState === "open" ? "left-84" : "left-8"} transition-all duration-300 ease-in`}
        >
            <p className="text-xl font-bold">
                Found {displayedCount} {kind}
                {plural} of length {length} between {nameOf(player1)} and{" "}
                {nameOf(player2)}
            </p>
            {!isAll && (
                <p className="text-xl font-bold">
                    {[...pathNodes]
                        .reverse()
                        .map((id) => graph.getNodeAttributes(id).label)
                        .join(" > ")}
                </p>
            )}
        </div>
    );
}