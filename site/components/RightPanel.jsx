import PlayerDropdown from "./PlayerDropdown";
import ShowConnectionsButton from "./ShowConnectionsButton";

export default function RightPanel({ open }) {
    return (
        <div
            className={`px-1.75 py-7 transition-all duration-300 ease-in flex h-screen  flex-col rounded-l border border-[#262a30] overflow-hidden origin-right ${open === "open" ? "w-[20rem]" : "w-0! invisible scale-x-0"}`}
        >
            <PlayerDropdown />
            <ShowConnectionsButton />
        </div>
    );
}
