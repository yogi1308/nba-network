import { useMemo, useState, useRef, useEffect } from "react";
import { graph } from "../src/graph/engine.js";

const ALL_PLAYERS = graph
    .nodes()
    .map((key) => ({ key, label: graph.getNodeAttributes(key).label }))
    .sort((a, b) => a.label.localeCompare(b.label));

const ALL_OPTION = { key: null, label: "All Players" };

export default function PlayerDropdown({ value, onSelect = () => {} }) {
    const [selectedKey, setSelectedKey] = useState(value ?? null);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const isControlled = value !== undefined;
    const selected = isControlled ? value : selectedKey;
    const selectedLabel =
        ALL_PLAYERS.find((p) => p.key === selected)?.label ?? "";
    const displayText = selectedLabel || ALL_OPTION.label;

    const options = useMemo(() => {
        const q = query.trim().toLowerCase();
        const matches = q
            ? ALL_PLAYERS.filter((p) => p.label.toLowerCase().includes(q))
            : ALL_PLAYERS;
        const allMatches =
            !q || ALL_OPTION.label.toLowerCase().includes(q);
        return [...(allMatches ? [ALL_OPTION] : []), ...matches];
    }, [query]);

    useEffect(() => {
        function onClickOutside(e) {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    useEffect(() => {
        const el = listRef.current?.children[activeIndex];
        el?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, isOpen]);

    function pickOption(option) {
        if (!isControlled) setSelectedKey(option.key);
        onSelect(option.key);
        setQuery("");
        setIsOpen(false);
        inputRef.current?.blur();
    }

    function handleKeyDown(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setIsOpen(true);
            setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const option = options[activeIndex];
            if (isOpen && option) pickOption(option);
        } else if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        } else {
            setActiveIndex(0);
        }
    }

    return (
        <div ref={rootRef} className="relative">
            <input
                ref={inputRef}
                value={query !== "" ? query : displayText}
                placeholder="Search a player…"
                className="w-full rounded-lg border border-[#262a30] bg-[#0b0b0f] px-3 py-2 pr-8 text-sm text-white placeholder-[#5a5f66] outline-none focus:border-[#3d4148]"
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={(e) => {
                    setIsOpen(true);
                    e.target.select();
                }}
                onClick={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
            />
            <button
                type="button"
                tabIndex={-1}
                aria-label={isOpen ? "Close player list" : "Open player list"}
                onClick={() => {
                    if (!isOpen) {
                        setIsOpen(true);
                        inputRef.current?.focus();
                    } else {
                        setIsOpen(false);
                    }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-[#5a5f66] hover:text-white"
            >
                <svg
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            {isOpen && (
                <ul
                    ref={listRef}
                    className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-[#262a30] bg-[#0b0b0f] py-1 shadow-lg shadow-black/50"
                >
                    {options.length === 0 && (
                        <li className="px-3 py-2 text-sm text-[#5a5f66]">
                            No Results
                        </li>
                    )}
                    {options.map((p, i) => (
                        <li
                            key={p.key ?? "all"}
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => pickOption(p)}
                            className={`cursor-pointer px-3 py-2 text-sm ${
                                i === activeIndex
                                    ? "bg-[#1c1f24] text-white"
                                    : "text-[#c7ccd1]"
                            }`}
                        >
                            {p.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}