import PlayerDropdown from "./PlayerDropdown";
import ArrowLeftSVG from "../assests/svg/ArrowLeftSVG.jsx";
import { useStore } from "../src/store.js";

export default function ShortestPath() {
    const view = useStore((s) => s.view);
    const player1 = useStore((s) => s.player1);
    const player2 = useStore((s) => s.player2);
    const numPaths = useStore((s) => s.numPaths);
    const pathIndex = useStore((s) => s.pathIndex);
    const path = useStore((s) => s.path);
    const isShortest = path === "alt" || path === "all";

    return (
        <>
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
                {view === "normal" || !isShortest ? (
                    <button
                        className={`border w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                        disabled={player1 === null || player2 === null}
                        onClick={() => {
                            useStore.getState().setView("path");
                            useStore.getState().setPath("alt");
                            useStore.getState().setPathIndex(0);
                        }}
                    >
                        Show Shortest Path
                    </button>
                ) : (
                    <>
                        <button
                            className={`border border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                            disabled={pathIndex === 0 || numPaths === 0}
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
                            disabled={pathIndex === numPaths - 1 || numPaths === 0}
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
        </>
    );
}