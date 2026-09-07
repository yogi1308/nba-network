import PlusSVG from "../assests/svg/PlusSVG.jsx";
import MinusSVG from "../assests/svg/MinusSVG.jsx";
import FitSVG from "../assests/svg/FitSVG.jsx";
import { useStore } from "../src/store.js";

export default function CanvasControls() {
    const handle = () => useStore.getState().sigma?.getCamera();
    return (
        <div className="flex flex-col">
            <button
                className="hover:bg-white cursor-pointer transition-all duration-150 ease-in rounded-[3px]"
                title="Zoom In"
                onClick={() => {
                    handle()?.animatedZoom({ factor: 1.5, duration: 200 });
                }}
            >
                <PlusSVG />
            </button>
            <button
                className="hover:bg-white cursor-pointer transition-all duration-150 ease-in rounded-[3px]"
                title="Zoom Out"
                onClick={() => {
                    handle()?.animatedUnzoom({ factor: 1.5, duration: 200 });
                }}
            >
                <MinusSVG />
            </button>
            <button
                className="hover:bg-white cursor-pointer transition-all duration-150 ease-in rounded-[3px]"
                title="Fit"
                onClick={() => {
                    handle()?.animatedReset({ duration: 200 });
                }}
            >
                <FitSVG />
            </button>
        </div>
    );
}
