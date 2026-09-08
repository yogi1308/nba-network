import PlayerDropdown from "./PlayerDropdown";
import ArrowLeftSVG from "../assests/svg/ArrowLeftSVG.jsx";
import { useStore } from "../src/store.js";
import { useEffect, useState } from "react";
import Slider from "./Slider.jsx";
import NumberInput from "./NumberInput.jsx";
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
    const path = useStore((s) => s.path);
    const minDistance = useStore((s) => s.minDistance);
    const minPathDistance = useStore((s) => s.minPathDistance);
    const [distance1, setDistance1] = useState("");
    const [distance2, setDistance2] = useState("");
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
                    <div className="flex gap-4 mt-2 justify-center">
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
                                Show Shortest Path
                            </button>
                        ) : (
                            <>
                                <button
                                    className={`border border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                                    disabled={pathIndex === 0}
                                    onClick={() => {
                                        useStore.getState().setView("path");
                                        useStore.getState().setPath("alt");
                                        if (pathIndex > 0) {
                                            useStore.getState().setPathIndex(pathIndex - 1);
                                        } else {
                                            useStore.getState().setPathIndex(numPaths - 1);
                                        }
                                    }}
                                >
                                    <ArrowLeftSVG />
                                </button>
                                <p className="text-nowrap">
                                    Path {pathIndex + 1} of {numPaths}
                                </p>
                                <button
                                    className={`rotate-180 border border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                                    disabled={pathIndex === numPaths - 1}
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
                                    <ArrowLeftSVG />
                                </button>
                            </>
                        )}
                    </div>
                    <button
                        className={`border mt-2 w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                        disabled={player1 === null || player2 === null}
                        onClick={() => {
                            useStore.getState().setView("path");
                            if (path === "all") {
                                useStore.getState().setPath("alt");
                            } else {
                                useStore.getState().setPath("all");
                            }
                        }}
                    >
                        {path === "all"
                            ? "Show A Single Shortest Path"
                            : "Show All Shortest Paths"}
                    </button>
                    <NumberInput
                        id="path-length"
                        label="Find Path of Distance"
                        value={minPathDistance}
                        min={minDistance}
                        max={15}
                        disabled={view !== "path"}
                        onChange={(e) => { useStore.getState().setMinPathDistance(e.target.value); useStore.getState().setPath("minLengthPathAlt") }}
                        placeholder={`${minDistance ?? 3} - 15`}
                    />
                    {minPathDistance > 0 &&
                        (minPathDistance < minDistance || minPathDistance > 15) && (
                            <p className="text-red-400 text-sm">
                                Must be between {minDistance} and 15
                            </p>
                        )}
                    <div className="flex gap-4 mt-2 justify-center">
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
                                Show Shortest Path
                            </button>
                        ) : (
                            <>
                                <button
                                    className={`border border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                                    disabled={pathIndex === 0}
                                    onClick={() => {
                                        useStore.getState().setView("path");
                                        useStore.getState().setPath("alt");
                                        if (pathIndex > 0) {
                                            useStore.getState().setPathIndex(pathIndex - 1);
                                        } else {
                                            useStore.getState().setPathIndex(numPaths - 1);
                                        }
                                    }}
                                >
                                    <ArrowLeftSVG />
                                </button>
                                <p className="text-nowrap">
                                    Path {pathIndex + 1} of {numPaths}
                                </p>
                                <button
                                    className={`rotate-180 border border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                                    disabled={pathIndex === numPaths - 1}
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
                                    <ArrowLeftSVG />
                                </button>
                            </>
                        )}
                    </div>
                    <button
                        className={`border mt-2 w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                        disabled={player1 === null || player2 === null}
                        onClick={() => {
                            useStore.getState().setView("path");
                            if (path === "all") {
                                useStore.getState().setPath("alt");
                            } else {
                                useStore.getState().setPath("all");
                            }
                        }}
                    >
                        {path === "all"
                            ? "Show A Single Shortest Path"
                            : "Show All Shortest Paths"}
                    </button>
                    <div className="flex flex-col gap-1 ">
                        <p className="relative translate-y-2">Find All Paths of Distances between</p>
                        <div className="flex gap-2 justify-between">
                        <NumberInput
                            id="distance-1"
                            label="Distance 1"
                            value={distance1}
                            min={minDistance}
                            max={15}
                            disabled={view !== "path"}
                            onChange={(e) => setDistance1(e.target.value)}
                            placeholder={`${minDistance ?? 3} - 15`}
                        />
                        <NumberInput
                            id="distance-2"
                            label="Distance 2"
                            value={distance2}
                            min={distance1 !== "" ? Number(distance1) + 1 : minDistance}
                            max={15}
                            disabled={view !== "path"}
                            onChange={(e) => setDistance2(e.target.value)}
                            placeholder={`${minDistance ?? 3} - 15`}
                        />
                    </div>

                    {distance1 !== "" &&
                        (Number(distance1) < minDistance || Number(distance1) > 15) && (
                            <p className="text-red-400 text-sm">
                                Distance 1 must be between {minDistance} and 15
                            </p>
                        )}
                    {distance2 !== "" &&
                        (Number(distance2) < minDistance || Number(distance2) > 15) && (
                            <p className="text-red-400 text-sm">
                                Distance 2 must be between {minDistance} and 15
                            </p>
                        )}
                    {distance1 !== "" &&
                        distance2 !== "" &&
                        Number(distance1) >= Number(distance2) && (
                            <p className="text-red-400 text-sm">
                                Distance 1 must be less than Distance 2
                            </p>
                        )}
                    <div className="flex gap-4 mt-2 justify-center">
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
                                Show Shortest Path
                            </button>
                        ) : (
                            <>
                                <button
                                    className={`border border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                                    disabled={pathIndex === 0}
                                    onClick={() => {
                                        useStore.getState().setView("path");
                                        useStore.getState().setPath("alt");
                                        if (pathIndex > 0) {
                                            useStore.getState().setPathIndex(pathIndex - 1);
                                        } else {
                                            useStore.getState().setPathIndex(numPaths - 1);
                                        }
                                    }}
                                >
                                    <ArrowLeftSVG />
                                </button>
                                <p className="text-nowrap">
                                    Path {pathIndex + 1} of {numPaths}
                                </p>
                                <button
                                    className={`rotate-180 border border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                                    disabled={pathIndex === numPaths - 1}
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
                                    <ArrowLeftSVG />
                                </button>
                            </>
                        )}
                    </div>
                    <button
                        className={`border mt-2 w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                        disabled={player1 === null || player2 === null}
                        onClick={() => {
                            useStore.getState().setView("path");
                            if (path === "all") {
                                useStore.getState().setPath("alt");
                            } else {
                                useStore.getState().setPath("all");
                            }
                        }}
                    >
                        {path === "all"
                            ? "Show A Single Shortest Path"
                            : "Show All Shortest Paths"}
                    </button>
                </div>
            </div>
        </div>
        </div >
    );
}
