import PlayerDropdown from "./PlayerDropdown";
import ShowConnectionsButton from "./ShowConnectionsButton";
import { useStore } from "../src/store.js";
import { useEffect, useState } from "react";
import Slider from "./Slider.jsx";
import { maxDepthOf } from "../src/graph/engine.js";

export default function LeftPanel({ open }) {
    const selectedPlayer = useStore((s) => s.selectedPlayer);
    const [maxDepth, setMaxDepth] = useState(9);

    useEffect(() => {
        setMaxDepth(selectedPlayer ? maxDepthOf(selectedPlayer) : 9);
    }, [selectedPlayer]);

    return (
        <div
            className={`overflow-hidden py-8 transition-all duration-300 ease-in h-screen rounded-[8px] border border-[#262a30] ${open === "open" ? "w-[20rem]" : "w-0 border-0"}`}
        >
            <div className="mx-1.5 flex flex-col gap-4">
                {/* <div className="flex flex-col gap-1"> */}
                {/*     <p className="text-xl font-bold">Filter Players TODO</p> */}
                {/*     <PlayerDropdown dataFor={"selectedPlayer"} /> */}
                {/* </div> */}
                <div className="flex flex-col gap-4">
                    <p className="text-xl font-bold">Search Player</p>
                    <PlayerDropdown dataFor={"selectedPlayer"} />
                    <ShowConnectionsButton />
                    <div>
                        <p>Depth</p>
                        <Slider max={maxDepth} defaultLabel={"All Players"} />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-xl font-bold">Path Finder TODO</p>
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
                        <button
                            className={`border w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 `}
                            onClick={() => {
                                useStore.getState().setView("path");
                                useStore.getState().setPath("alt");
                                let {pathIndex, numPaths} = useStore.getState()
                                if (pathIndex < numPaths - 1) useStore.getState().setPathIndex(pathIndex + 1)
                                useStore.getState().setPathIndex(0)
                            }}
                        >
                            Next Path
                        </button>
                        <button
                            className={`border w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 `}
                            onClick={() => {
                                useStore.getState().setView("path");
                                useStore.getState().setPath("alt");
                                let {pathIndex, numPaths} = useStore.getState()
                                if (pathIndex - 1 > 0) useStore.getState().setPathIndex(pathIndex - 1)
                                useStore.getState().setPathIndex(numPaths - 1)
                            }}
                        >
                            Previous Path
                        </button>
                    </div>
                    <button
                        className={`border mt-2 w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 `}
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
