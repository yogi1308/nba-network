import Analysis from "./Analysis.jsx";
import Filter from "./Filter.jsx";
import SearchPlayer from "./SearchPlayer.jsx";
import ShortestPath from "./ShortestPath.jsx";
import ShortestPathMinDistance from "./ShortestPathMinDistance.jsx";
import ShortestPathRange from "./ShortestPathRange.jsx";

export default function LeftPanel({ open }) {
    return (
        <div
            className={`overflow-hidden py-8 pb-2 transition-all duration-300 ease-in h-screen rounded-[8px] border border-[#262a30] ${open === "open" ? "w-[20rem]" : "w-0 border-0 "}`}
        >
            <div className="overflow-y-scroll mx-1.5 mr-0 px-2 flex flex-col gap-4 h-full">
                <Filter />
                <SearchPlayer />
                <div className="flex flex-col gap-1">
                    <ShortestPath />
                    <ShortestPathMinDistance />
                    <ShortestPathRange />
                </div>
                <Analysis />
            </div>
        </div>
    );
}
