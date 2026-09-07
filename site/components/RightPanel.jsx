import PlayerDropdown from "./PlayerDropdown";

export default function RightPanel({ open }) {
    return (
        <div
            className={`px-1.75 py-7 transition-all duration-300 ease-in flex h-screen  flex-col rounded-l border border-[#262a30] overflow-hidden origin-right ${open === "open" ? "w-[20rem]" : "w-0! invisible scale-x-0"}`}
        >
            <PlayerDropdown />
            <button className="border border-white rounded-[5px] my-4 hover:bg-white hover:text-black transition-all duration-150 ease-in cursor-pointer py-0.2">Show Connections</button>
        </div>
    );
}
