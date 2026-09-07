import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import SigmaCanvas from "./graph/SigmaCanvas";
import { useState } from "react";
import SidebarSVG from "../assests/svg/SidebarSVG.jsx";
import { useEffect } from "react";
import { useStore } from "./store.js";
import CanvasControls from "../components/CanvasControls.jsx";

export default function App() {
    const [rPanelState, setRPanelState] = useState("open");
    const [lPanelState, setLPanelState] = useState("open");
    useEffect(() => {
        setTimeout(() => {
            const { sigma } = useStore.getState();
            if (sigma) {
                sigma.resize();
                sigma.scheduleRefresh();
            }
        }, 320);
    }, [lPanelState, rPanelState]);

    return (
        <div className="flex flex-row">
            <div className="relative">
                <button
                    title={lPanelState === "open" ? "Close Sidebar" : "Open Sidebar"}
                    className={` absolute cursor-pointer z-1 ${lPanelState === "open" ? "right-1.5" : "-right-6"} scale-80 top-1 bg-black hover:scale-110 transition-all ease-in `}
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
                <div className={`backdrop-blur-xl absolute z-1 bottom-1.5 p-1 py-1.5 ${lPanelState === "open" ? "-right-12" : "-right-10"}  border border-[#262a30] rounded-[5px] `}>
                    <CanvasControls />
                </div>
            </div>
            <SigmaCanvas leftPanelOpen={lPanelState === "open"} />
            {/* <div className="relative"> */}
            {/*     <button */}
            {/*         title={rPanelState === "open" ? "Close Sidebar" : "Open Sidebar"} */}
            {/*         className={` absolute cursor-pointer ${rPanelState === "open" ? "left-1" : "-left-6 "} scale-80 rotate-180 top-0.5 bg-black hover:scale-110 transition-all ease-in `} */}
            {/*         onClick={() => { */}
            {/*             rPanelState === "open" */}
            {/*                 ? setRPanelState("closed") */}
            {/*                 : setRPanelState("open"); */}
            {/*         }} */}
            {/*     > */}
            {/*         <span> */}
            {/*             <SidebarSVG /> */}
            {/*         </span> */}
            {/*     </button> */}
            {/*     <RightPanel open={rPanelState} /> */}
            {/* </div> */}
        </div>
    );
}
