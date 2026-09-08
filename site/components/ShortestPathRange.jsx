import ArrowLeftSVG from "../assests/svg/ArrowLeftSVG.jsx";
import { useStore } from "../src/store.js";
import NumberInput from "./NumberInput.jsx";

export default function ShortestPathRange() {
    const view = useStore((s) => s.view);
    const path = useStore((s) => s.path);
    const player1 = useStore((s) => s.player1);
    const player2 = useStore((s) => s.player2);
    const minDistance = useStore((s) => s.minDistance);
    const pathRangeLow = useStore((s) => s.pathRangeLow);
    const pathRangeHigh = useStore((s) => s.pathRangeHigh);
    const numRangePaths = useStore((s) => s.numRangePaths);
    const rangePathIndex = useStore((s) => s.rangePathIndex);
    const rangeValid =
        pathRangeLow !== "" &&
        pathRangeHigh !== "" &&
        Number(pathRangeLow) >= minDistance &&
        Number(pathRangeHigh) <= 15 &&
        Number(pathRangeLow) < Number(pathRangeHigh);
    const isRange = path === "pathRangeAlt" || path === "pathRangeAll";

    return (
        <div className="flex flex-col gap-1 mt-2">
            <p className="relative translate-y-2">
                Find All Paths of Distances between
            </p>
            <div className="flex gap-2 justify-between">
                <NumberInput
                    id="distance-1"
                    label="Distance 1"
                    value={pathRangeLow}
                    min={minDistance}
                    max={15}
                    disabled={view !== "path"}
                    onChange={(e) => {
                        useStore.getState().setPathRangeLow(e.target.value);
                        const lo = Number(e.target.value);
                        const hi = Number(pathRangeHigh);
                        if (
                            lo >= minDistance &&
                            lo <= 15 &&
                            hi >= minDistance &&
                            hi <= 15 &&
                            lo < hi
                        ) {
                            useStore.getState().setPath("pathRangeAlt");
                        }
                    }}
                    placeholder={`${minDistance ?? 3} - 15`}
                />
                <NumberInput
                    id="distance-2"
                    label="Distance 2"
                    value={pathRangeHigh}
                    min={pathRangeLow !== "" ? Number(pathRangeLow) + 1 : minDistance}
                    max={15}
                    disabled={view !== "path"}
                    onChange={(e) => {
                        useStore.getState().setPathRangeHigh(e.target.value);
                        const lo = Number(pathRangeLow);
                        const hi = Number(e.target.value);
                        if (
                            lo >= minDistance &&
                            lo <= 15 &&
                            hi >= minDistance &&
                            hi <= 15 &&
                            lo < hi
                        ) {
                            useStore.getState().setPath("pathRangeAlt");
                        }
                    }}
                    placeholder={`${minDistance ?? 3} - 15`}
                />
            </div>

            {pathRangeLow !== "" &&
                (Number(pathRangeLow) < minDistance || Number(pathRangeLow) > 15) && (
                    <p className="text-red-400 text-sm">
                        Distance 1 must be between {minDistance} and 15
                    </p>
                )}
            {pathRangeHigh !== "" &&
                (Number(pathRangeHigh) < minDistance || Number(pathRangeHigh) > 15) && (
                    <p className="text-red-400 text-sm">
                        Distance 2 must be between {minDistance} and 15
                    </p>
                )}
            {pathRangeLow !== "" &&
                pathRangeHigh !== "" &&
                Number(pathRangeLow) >= Number(pathRangeHigh) && (
                    <p className="text-red-400 text-sm">
                        Distance 1 must be less than Distance 2
                    </p>
                )}
            <div className="flex gap-4 mt-2 justify-center">
                {view === "normal" || !isRange ? (
                    <button
                        className={`border w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                        disabled={player1 === null || player2 === null || !rangeValid}
                        onClick={() => {
                            useStore.getState().setView("path");
                            useStore.getState().setPath("pathRangeAlt");
                            useStore.getState().setRangePathIndex(0);
                        }}
                    >
                        Show Path of Length {pathRangeLow} - {pathRangeHigh}
                    </button>
                ) : (
                    <>
                        <button
                            className={`border border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                            disabled={rangePathIndex === 0 || !rangeValid || numRangePaths === 0}
                            onClick={() => {
                                useStore.getState().setView("path");
                                useStore.getState().setPath("pathRangeAlt");
                                if (rangePathIndex > 0) {
                                    useStore.getState().setRangePathIndex(rangePathIndex - 1);
                                } else {
                                    useStore.getState().setRangePathIndex(numRangePaths - 1);
                                }
                            }}
                        >
                            <ArrowLeftSVG />
                        </button>
                        <p className="text-nowrap">
                            Path {rangeValid ? rangePathIndex + 1 : 0} of{" "}
                            {rangeValid ? numRangePaths : 0}
                        </p>
                        <button
                            className={`rotate-180 border border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                            disabled={
                                rangePathIndex === numRangePaths - 1 ||
                                !rangeValid ||
                                numRangePaths === 0
                            }
                            onClick={() => {
                                useStore.getState().setView("path");
                                useStore.getState().setPath("pathRangeAlt");
                                if (rangePathIndex < numRangePaths - 1) {
                                    useStore.getState().setRangePathIndex(rangePathIndex + 1);
                                } else {
                                    useStore.getState().setRangePathIndex(0);
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
                disabled={player1 === null || player2 === null || !rangeValid}
                onClick={() => {
                    useStore.getState().setView("path");
                    if (path === "pathRangeAll") {
                        useStore.getState().setPath("pathRangeAlt");
                    } else {
                        useStore.getState().setPath("pathRangeAll");
                    }
                }}
            >
                {path === "pathRangeAll"
                    ? `Show A Single Path of Length ${pathRangeLow} - ${pathRangeHigh}`
                    : `Show All Paths of Length ${pathRangeLow} - ${pathRangeHigh}`}
            </button>
        </div>
    );
}
