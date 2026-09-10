import PlayerDropdown from "./PlayerDropdown";
import { useStore } from "../src/store.js";
import { useEffect, useState } from "react";
import Slider from "./Slider.jsx";
import { maxDepthOf, graph } from "../src/graph/engine.js";

export default function SearchPlayer() {
    const selectedPlayer = useStore((s) => s.selectedPlayer);
    const cumulativeNodes = useStore((s) => s.cumulativeNodes);
    useStore((s) => s.graphUpdated);
    const view = useStore((s) => s.view);
    const [maxDepth, setMaxDepth] = useState(9);

    useEffect(() => {
        setMaxDepth(selectedPlayer ? maxDepthOf(selectedPlayer) : 9);
    }, [selectedPlayer]);

    return (
        <div className="flex flex-col gap-2">
            <p className="text-xl font-bold">Search Player</p>
            <PlayerDropdown dataFor={"selectedPlayer"} />
            <div>
                <p
                    className={
                        view === "path" ||
                            (view === "normal" && selectedPlayer === null)
                            ? "opacity-40"
                            : ""
                    }
                >
                    Depth
                </p>
                <fieldset
                    disabled={
                        view === "path" ||
                        (view === "normal" && selectedPlayer === null)
                    }
                    className={
                        view === "path" ||
                            (view === "normal" && selectedPlayer === null)
                            ? "opacity-40"
                            : ""
                    }
                >
                    <Slider max={maxDepth} defaultLabel={"All Players"} />
                </fieldset>
            </div>
            {view === "normal" && selectedPlayer !== null ? (
                <p>Players Discovered: {cumulativeNodes}/{graph.nodes().length}</p>
            ) : view === "normal" && selectedPlayer === null ? (
                <p>Total Players: {graph.nodes().length}</p>
            ) : (
                <button
                    className={`border w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 `}
                    onClick={() => {
                        useStore.getState().setView("normal");
                    }}
                >
                    Show Player
                </button>
            )}
        </div>
    );
}
