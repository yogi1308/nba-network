import LeftPanel from "../components/LeftPanel";
import SigmaCanvas from "./graph/SigmaCanvas";
import { useState } from "react";
import SidebarSVG from "../assests/svg/SidebarSVG.jsx";
import { useEffect } from "react";
import { useStore } from "./store.js";
import CanvasControls from "../components/CanvasControls.jsx";
import PathRes from "../components/PathRes.jsx";

export default function App() {
    const [lPanelState, setLPanelState] = useState("open");
    const view = useStore((s) => s.view);
    useEffect(() => {
        setTimeout(() => {
            const { sigma } = useStore.getState();
            if (sigma) {
                sigma.resize();
                sigma.scheduleRefresh();
            }
        }, 320);
    }, [lPanelState]);

    return (
        <div className="relative flex flex-row overflow-hidden">
            <div className="relative">
                <button
                    title={lPanelState === "open" ? "Close Sidebar" : "Open Sidebar"}
                    className={` absolute cursor-pointer z-1 ${lPanelState === "open" ? "right-1.5 top-1" : "-right-6.5 top-0.5"} scale-80  bg-black hover:scale-110 transition-all ease-in active:scale-95`}
                    onClick={() => {
                        lPanelState === "open"
                            ? setLPanelState("closed")
                            : setLPanelState("open");
                    }}
                >
                    <span>
                        <SidebarSVG />
                    </span>
                </button>
                <LeftPanel open={lPanelState} />
                <div
                    className={`backdrop-blur-xl absolute z-1 bottom-1.5 p-1 py-1.5 ${lPanelState === "open" ? "-right-12" : "-right-10"}  border border-[#262a30] rounded-[5px] `}
                >
                    <CanvasControls />
                </div>
            </div>
            {view === "path" && <PathRes lPanelState={lPanelState} />}
            <SigmaCanvas leftPanelOpen={lPanelState === "open"} />
        </div>
    );
}
