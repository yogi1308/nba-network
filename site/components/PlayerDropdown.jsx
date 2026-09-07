import { useMemo, useState, useRef, useEffect } from "react";
import { graph } from "../src/graph/engine.js";
import { useStore } from "../src/store.js";

// Flatten the graph into a searchable list of players: every node becomes
// { key } (the node id, e.g. "76001") plus { label } (the display name),
// sorted alphabetically for the dropdown list.
const ALL_PLAYERS = graph
    .nodes()
    .map((key) => ({ key, label: graph.getNodeAttributes(key).label }))
    .sort((a, b) => a.label.localeCompare(b.label));

// The "clear selection" option. key: null maps to the store's default
// "no player selected" state, so the whole graph is shown.
const ALL_OPTION = { key: null, label: "All Players" };
const PLAYER1 = { key: null, label: "Player 1" };
const PLAYER2 = { key: null, label: "Player 2" };

export default function PlayerDropdown({ dataFor }) {
    // selectedKey: currently chosen player node id (null = All Players).
    const [selectedKey, setSelectedKey] = useState(null);
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    // query: whatever the user is currently typing into the search box.
    const [query, setQuery] = useState("");
    // isOpen: whether the options list is shown.
    const [isOpen, setIsOpen] = useState(false);
    // activeIndex: row currently highlighted (hover / arrow keys).
    const [activeIndex, setActiveIndex] = useState(0);
    // rootRef: the wrapper div, used to detect clicks outside the component.
    const rootRef = useRef(null);
    // inputRef: the search input, used for focus()/select()/blur().
    const inputRef = useRef(null);
    // listRef: the options <ul>, used to scroll the active row into view.
    const listRef = useRef(null);

    // The "clear selection" option, chosen by which context the dropdown
    // is used in, so its label varies with the dataFor prop.
    const defaultOption =
        dataFor === "player1" ? PLAYER1 :
        dataFor === "player2" ? PLAYER2 :
        ALL_OPTION;

    // What to show in the input when the user is not typing: the selected
    // player's name, or the default option label if nothing is chosen.
    const displayText =
        (dataFor === "player1"
            ? ALL_PLAYERS.find((p) => p.key === player1)?.label
            : dataFor === "player2"
              ? ALL_PLAYERS.find((p) => p.key === player2)?.label
              : ALL_PLAYERS.find((p) => p.key === selectedKey)?.label) ??
        defaultOption.label;

    // The rows to render in the dropdown, recomputed only when the query changes.
    const options = useMemo(() => {
        const q = query.trim().toLowerCase();
        // Filter players by substring match; empty query shows everyone.
        const matches = q
            ? ALL_PLAYERS.filter((p) => p.label.toLowerCase().includes(q))
            : ALL_PLAYERS;
        // Only offer the default option when the query can't rule it out.
        const allMatches = !q || defaultOption.label.toLowerCase().includes(q);
        return [...(allMatches ? [defaultOption] : []), ...matches];
    }, [query]);

    useEffect(() => {
        if (dataFor === "selectedPlayer") {
            useStore.getState().setSelectedPlayer(selectedKey);
        } else if (dataFor === "player1") {
            useStore.getState().setPlayer1(player1);
        } else if (dataFor === "player2") {
            useStore.getState().setPlayer2(player2);
        }
    }, [dataFor, player1, player2, selectedKey]);

    // Close the dropdown when the user clicks anywhere outside it.
    useEffect(() => {
        function onClickOutside(e) {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    // Keep the highlighted row visible when navigating with arrow keys:
    // scroll the ul so the active <li> is in view within its overflow.
    useEffect(() => {
        const el = listRef.current?.children[activeIndex];
        el?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, isOpen]);

    // Commit a selection: store it, notify the parent, and reset the UI so the
    // input goes back to showing the player's name instead of the query text.
    function pickOption(option) {
        if (dataFor === "selectedPlayer") {
            setSelectedKey(option.key);
        } else if (dataFor === "player1") {
            setPlayer1(option.key);
        } else if (dataFor === "player2") {
            setPlayer2(option.key);
        }
        setQuery("");
        setIsOpen(false);
        inputRef.current?.blur();
    }

    // Full keyboard navigation for the combobox.
    function handleKeyDown(e) {
        if (e.key === "ArrowDown") {
            e.preventDefault(); // stop the input caret from jumping
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
            // Any typed character: restart highlight at the top option.
            setActiveIndex(0);
        }
    }

    return (
        <div ref={rootRef} className="relative">
            <input
                ref={inputRef}
                // While filtering show the typed text; otherwise the selection.
                value={query !== "" ? query : displayText}
                placeholder="Search a player…"
                className="w-full rounded-lg border border-[#262a30] bg-[#0b0b0f] px-3 py-2 pr-8 text-sm text-white placeholder-[#5a5f66] outline-none focus:border-[#3d4148]"
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                // Opening shows all options and selects the current text so
                // typing immediately replaces it (no need for Ctrl+A).
                onFocus={(e) => {
                    setIsOpen(true);
                    e.target.select();
                }}
                // Re-open if the input is already focused (e.g. after the arrow
                // button closed the list) but the user clicks it again.
                onClick={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
            />
            <button
                type="button"
                // Keep the arrow button out of the tab order; the input is the
                // only keyboard entry point.
                tabIndex={-1}
                aria-label={isOpen ? "Close player list" : "Open player list"}
                onClick={() => {
                    // Focus on open so typing flows naturally; on close just
                    // close, otherwise the re-open would trigger instantly.
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
                    // Chevron points down when closed, up (rotated) when open.
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
                        <li className="px-3 py-2 text-sm text-[#5a5f66]">No Results</li>
                    )}
                    {options.map((p, i) => (
                        <li
                            key={p.key ?? "all"}
                            // Sync highlight with the keyboard activeIndex so
                            // hover and arrows don't fight each other.
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => pickOption(p)}
                            className={`cursor-pointer px-3 py-2 text-sm ${i === activeIndex ? "bg-[#1c1f24] text-white" : "text-[#c7ccd1]"}`}
                        >
                            {p.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
