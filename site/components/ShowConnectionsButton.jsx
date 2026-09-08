import { useStore } from "../src/store.js";

export default function ShowConnectionsButton() {
    const showEdges = useStore((s) => s.showEdges);
    const setShowEdges = useStore((s) => s.setShowEdges);
    return (
        <button
            aria-pressed={showEdges}
            className={`border w-full border-white rounded-[5px] py-0.2 cursor-pointer transition-all duration-150 ease-in 
            hover:bg-white hover:text-black active:scale-95
            `}
            onClick={() => { setShowEdges(!showEdges); useStore.getState().setView("normal")  }}
        >
            {showEdges ? "Hide" : "Show"} Connections
        </button>
    );
}
