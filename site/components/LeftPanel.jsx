export default function LeftPanel({ open }) {
    return (
        <div
            className={` transition-all duration-300 ease-in flex h-screen  flex-col rounded-l border border-[#262a30] ${open === "open" ? "w-[20rem]" : "w-0"}`}
        ></div>
    );
}
