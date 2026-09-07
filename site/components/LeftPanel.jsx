import PlayerDropdown from "./PlayerDropdown";

export default function LeftPanel({ open }) {
    return (
        <div
            className={`overflow-hidden py-8 transition-all duration-300 ease-in flex h-screen  flex-col rounded-[8px] border border-[#262a30] ${open === "open" ? "w-[20rem]" : "w-0 border-0"}`}
        >
            <div className="mx-1.5">
                <PlayerDropdown />
                <button className="border w-full border-white rounded-[5px] my-4 hover:bg-white hover:text-black transition-all duration-150 ease-in cursor-pointer py-0.2">
                    Show Connections
                </button>
            </div>
        </div>
    );
}
