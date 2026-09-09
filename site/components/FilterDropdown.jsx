import { useMemo, useRef, useState, useEffect } from "react";

const CLEAR_OPTION = { key: "__clear__", label: "Clear All" };

export default function FilterDropdown({
    options,
    selected,
    onToggle,
    placeholder,
    ariaLabel,
}) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const selectedSet = useMemo(() => new Set(selected), [selected]);
    const selectedOptions = useMemo(
        () => options.filter((o) => selectedSet.has(o.key)),
        [options, selectedSet],
    );

    const matches = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q
            ? options.filter((o) => o.label.toLowerCase().includes(q))
            : options;
    }, [query, options]);

    const listRows = useMemo(
        () => [...(selectedOptions.length ? [CLEAR_OPTION] : []), ...matches],
        [selectedOptions, matches],
    );

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

    function toggle(option) {
        if (option.key === CLEAR_OPTION.key) {
            for (const key of selected) onToggle(key);
        } else {
            onToggle(option.key);
        }
        setQuery("");
        inputRef.current?.focus();
    }

    function handleKeyDown(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setIsOpen(true);
            setActiveIndex((i) => Math.min(i + 1, listRows.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const option = listRows[activeIndex];
            if (isOpen && option) toggle(option);
        } else if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        } else {
            setActiveIndex(0);
        }
    }

    return (
        <div ref={rootRef} className="relative">
            <div
                onClick={() => {
                    setIsOpen(true);
                    inputRef.current?.focus();
                }}
                className={`flex min-h-[2.5rem] cursor-pointer flex-wrap items-center gap-1 rounded-lg border bg-[#0b0b0f] py-1.5 pl-2 pr-8 text-sm ${isOpen ? "border-[#3d4148]" : "border-[#262a30]"}`}
            >
                {selectedOptions.length > 0 && (
                    <span className="rounded bg-[#1c1f24] px-2 py-0.5 text-xs text-white">
                        {selectedOptions.length} selected
                    </span>
                )}
                <input
                    ref={inputRef}
                    value={query}
                    placeholder={selectedOptions.length ? "" : placeholder}
                    aria-label={ariaLabel}
                    className="min-w-[4rem] flex-1 bg-transparent py-1 text-white placeholder-[#5a5f66] outline-none"
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <button
                type="button"
                tabIndex={-1}
                aria-label={isOpen ? "Close filter list" : "Open filter list"}
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
                    {listRows.length === 0 && (
                        <li className="px-3 py-2 text-sm text-[#5a5f66]">
                            No Results
                        </li>
                    )}
                    {listRows.map((opt, i) => (
                        <li
                            key={opt.key}
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => toggle(opt)}
                            className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm ${i === activeIndex ? "bg-[#1c1f24] text-white" : "text-[#c7ccd1]"}`}
                        >
                            <span>{opt.label}</span>
                            <span className="text-xs text-green-500">
                                {selectedSet.has(opt.key) ? "✓" : ""}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}