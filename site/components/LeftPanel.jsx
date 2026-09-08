import PlayerDropdown from "./PlayerDropdown";
import ShowConnectionsButton from "./ShowConnectionsButton";
import { useStore } from "../src/store.js";
import { useEffect, useState } from "react";
import Slider from "./Slider.jsx";
import { maxDepthOf } from "../src/graph/engine.js";

export default function LeftPanel({ open }) {
    const selectedPlayer = useStore((s) => s.selectedPlayer);
    const player1 = useStore((s) => s.player1);
    const player2 = useStore((s) => s.player2);
    const cumulativeNodes = useStore((s) => s.cumulativeNodes);
    const [maxDepth, setMaxDepth] = useState(9);
    const view = useStore((s) => s.view);
    const numPaths = useStore((s) => s.numPaths);
    const pathIndex = useStore((s) => s.pathIndex);
    useEffect(() => {
        setMaxDepth(selectedPlayer ? maxDepthOf(selectedPlayer) : 9);
    }, [selectedPlayer]);

    return (
        <div
            className={`overflow-hidden py-8 transition-all duration-300 ease-in h-screen rounded-[8px] border border-[#262a30] ${open === "open" ? "w-[20rem]" : "w-0 border-0"}`}
        >
            <div className="mx-1.5 flex flex-col gap-4">
                <div className="flex flex-col gap-4">
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
                        <p>Players Discovered: {cumulativeNodes}/5122</p>
                    ) : view === "normal" && selectedPlayer === null ? (
                        <p>Total Players: 5122</p>
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
                <div className="flex flex-col gap-1">
                    <p className="text-xl font-bold">Shortest Path</p>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <p>Player 1</p>
                            <PlayerDropdown dataFor={"player1"} defaultLabel={"Player 1"} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p>Player 2</p>
                            <PlayerDropdown dataFor={"player2"} defaultLabel={"Player 2"} />
                        </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                        {view === "normal" ? (
                            <button
                                className={`border w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                                disabled={player1 === null || player2 === null}
                                onClick={() => {
                                    useStore.getState().setView("path");
                                    useStore.getState().setPath("alt");
                                    if (pathIndex < numPaths - 1)
                                        useStore.getState().setPathIndex(pathIndex + 1);
                                    useStore.getState().setPathIndex(0);
                                }}
                            >
                                Show Path
                            </button>
                        ) : (
                            <>
                                <button
                                    className={`border w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 `}
                                    onClick={() => {
                                        useStore.getState().setView("path");
                                        useStore.getState().setPath("alt");
                                        if (pathIndex < numPaths - 1) {
                                            useStore.getState().setPathIndex(pathIndex + 1);
                                        } else {
                                            useStore.getState().setPathIndex(0);
                                        }
                                    }}
                                >
                                    Next Path
                                </button>
                                <p className="text-nowrap">Path {pathIndex + 1}</p>
                                <button
                                    className={`border w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 `}
                                    onClick={() => {
                                        useStore.getState().setView("path");
                                        useStore.getState().setPath("alt");
                                        if (pathIndex - 1 > 0) {
                                            useStore.getState().setPathIndex(pathIndex - 1);
                                        } else {
                                            useStore.getState().setPathIndex(numPaths - 1);
                                        }
                                    }}
                                >
                                    Previous Path
                                </button>
                            </>
                        )}
                    </div>
                    <button
                        className={`border mt-2 w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                        disabled={player1 === null || player2 === null}
                        onClick={() => {
                            useStore.getState().setView("path");
                            useStore.getState().setPath("all");
                        }}
                    >
                        All Paths
                    </button>
                </div>
            </div>
        </div>
    );
}
