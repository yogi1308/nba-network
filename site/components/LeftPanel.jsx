import Filter from "./Filter.jsx";
import SearchPlayer from "./SearchPlayer.jsx";
import ShortestPath from "./ShortestPath.jsx";
import ShortestPathMinDistance from "./ShortestPathMinDistance.jsx";
import ShortestPathRange from "./ShortestPathRange.jsx";

export default function LeftPanel({ open }) {
    return (
        <div
            className={`overflow-hidden py-8 transition-all duration-300 ease-in h-screen rounded-[8px] border border-[#262a30] ${open === "open" ? "w-[20rem]" : "w-0 border-0"}`}
        >
            <div className="mx-1.5 flex flex-col gap-4">
                <Filter />
                <SearchPlayer />
                <div className="flex flex-col gap-1">
                    <ShortestPath />
                    <ShortestPathMinDistance />
                    <ShortestPathRange />
                </div>
            </div>
        </div>
    );
}
