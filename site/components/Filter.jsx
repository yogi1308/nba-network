import FilterDropdown from "./FilterDropdown";
import { getFilterOptions } from "../src/graph/engine.js";
import { useStore } from "../src/store.js";

const { decades, teams } = getFilterOptions();

export default function Filter() {
    const selectedFilters = useStore((s) => s.selectedFilters);
    const toggleFilter = useStore((s) => s.toggleFilter);

    return (
        <div className="flex flex-col gap-4">
            <p className="text-xl font-bold">Filter</p>
            <FilterDropdown
                options={decades}
                selected={selectedFilters}
                onToggle={toggleFilter}
                placeholder="Filter by decade…"
                ariaLabel="Decade filter"
            />
            <FilterDropdown
                options={teams}
                selected={selectedFilters}
                onToggle={toggleFilter}
                placeholder="Filter by team…"
                ariaLabel="Team filter"
            />
        </div>
    );
}