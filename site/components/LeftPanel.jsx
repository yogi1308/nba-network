import PlayerDropdown from "./PlayerDropdown";
import ShowConnectionsButton from "./ShowConnectionsButton";

export default function LeftPanel({ open }) {
    return (
        <div
            className={`overflow-hidden py-8 transition-all duration-300 ease-in flex h-screen  flex-col rounded-[8px] border border-[#262a30] ${open === "open" ? "w-[20rem]" : "w-0 border-0"}`}
        >
            <div className="mx-1.5">
                <PlayerDropdown />
                <ShowConnectionsButton />
            </div>
        </div>
    );
}
