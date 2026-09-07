import PlayerDropdown from "./PlayerDropdown";
import ShowConnectionsButton from "./ShowConnectionsButton";
import { useStore } from "../src/store.js";
import { useEffect, useState } from "react";
import Slider from './Slider.jsx'
import { maxDepthOf } from "../src/graph/engine.js";

export default function LeftPanel({ open }) {
    const selectedPlayer = useStore((s) => s.selectedPlayer);
    const [maxDepth, setMaxDepth] = useState(9);

    useEffect(() => {
      setMaxDepth(selectedPlayer ? maxDepthOf(selectedPlayer) : 9);
    }, [selectedPlayer])
    
    return (
        <div
            className={`overflow-hidden py-8 transition-all duration-300 ease-in flex h-screen  flex-col rounded-[8px] border border-[#262a30] ${open === "open" ? "w-[20rem]" : "w-0 border-0"}`}
        >
            <div className="mx-1.5">
                <PlayerDropdown />
                <ShowConnectionsButton />
                <div>
                    <p>Depth</p>
                    <Slider max={maxDepth} />
                </div>
            </div>
        </div>
    );
}
