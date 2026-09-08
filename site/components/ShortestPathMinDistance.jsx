import ArrowLeftSVG from "../assests/svg/ArrowLeftSVG.jsx";
import { useStore } from "../src/store.js";
import NumberInput from "./NumberInput.jsx";

export default function ShortestPathMinDistance() {
    const view = useStore((s) => s.view);
    const path = useStore((s) => s.path);
    const player1 = useStore((s) => s.player1);
    const player2 = useStore((s) => s.player2);
    const minDistance = useStore((s) => s.minDistance);
    const minPathDistance = useStore((s) => s.minPathDistance);
    const numMinPaths = useStore((s) => s.numMinPaths);
    const minPathIndex = useStore((s) => s.minPathIndex);
    const minLenValid =
        minPathDistance !== "" &&
        Number(minPathDistance) >= minDistance &&
        Number(minPathDistance) <= 15;
    const isMinLen = path === "minLengthPathAlt" || path === "minLengthPathAll";

    return (
        <div className="mt-2">
            <NumberInput
                id="path-length"
                label="Find Path of Distance"
                value={minPathDistance}
                min={minDistance}
                max={15}
                disabled={view !== "path"}
                onChange={(e) => {
                    useStore.getState().setMinPathDistance(e.target.value);
                    const v = Number(e.target.value);
                    if (v >= minDistance && v <= 15) {
                        useStore.getState().setPath("minLengthPathAlt");
                    }
                }}
                placeholder={`${minDistance ?? 3} - 15`}
            />
            {minPathDistance > 0 &&
                (minPathDistance < minDistance || minPathDistance > 15) && (
                    <p className="text-red-400 text-sm">
                        Must be between {minDistance} and 15
                    </p>
                )}
            <div className="flex gap-4 mt-2 justify-center">
                {view === "normal" || !isMinLen ? (
                    <button
                        className={`border w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                        disabled={player1 === null || player2 === null || !minLenValid}
                        onClick={() => {
                            useStore.getState().setView("path");
                            useStore.getState().setPath("minLengthPathAlt");
                            useStore.getState().setMinPathIndex(0);
                        }}
                    >
                    Show Path of Length {minPathDistance}
                    </button>
                ) : (
                    <>
                        <button
                            className={`border border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                            disabled={minPathIndex === 0 || !minLenValid || numMinPaths === 0}
                            onClick={() => {
                                useStore.getState().setView("path");
                                useStore.getState().setPath("minLengthPathAlt");
                                if (minPathIndex > 0) {
                                    useStore.getState().setMinPathIndex(minPathIndex - 1);
                                } else {
                                    useStore.getState().setMinPathIndex(numMinPaths - 1);
                                }
                            }}
                        >
                            <ArrowLeftSVG />
                        </button>
                        <p className="text-nowrap">
                            Path {minLenValid ? minPathIndex + 1 : 0} of{" "}
                            {minLenValid ? numMinPaths : 0}
                        </p>
                        <button
                            className={`rotate-180 border border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white `}
                            disabled={
                                minPathIndex === numMinPaths - 1 || !minLenValid || numMinPaths === 0
                            }
                            onClick={() => {
                                useStore.getState().setView("path");
                                useStore.getState().setPath("minLengthPathAlt");
                                if (minPathIndex < numMinPaths - 1) {
                                    useStore.getState().setMinPathIndex(minPathIndex + 1);
                                } else {
                                    useStore.getState().setMinPathIndex(0);
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
                disabled={player1 === null || player2 === null || !minLenValid}
                onClick={() => {
                    useStore.getState().setView("path");
                    if (path === "minLengthPathAll") {
                        useStore.getState().setPath("minLengthPathAlt");
                    } else {
                        useStore.getState().setPath("minLengthPathAll");
                    }
                }}
            >
                {path === "minLengthPathAll"
                    ? `Show A Single Path of Length ${minPathDistance}`
                    : `Show All Paths of Length ${minPathDistance}`}
            </button>
        </div>
    );
}
