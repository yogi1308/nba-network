import { create } from "zustand";

export const useStore = create((set) => ({
    selectedPlayer: null,
    depth: 1,
    sigma: null,
    player1: null,
    player2: null,
    minDistance: null,
    view: "normal",
    path: "alt",
    pathIndex: 0,
    numPaths: 0,
    cumulativeNodes: 5122,
    pathNodes: [],
    minPathDistance: "",
    pathRangeLow: 0,
    pathRangeHigh: 0,

    setSelectedPlayer: (id) => set({ selectedPlayer: id, view: "normal" }),
    setDepth: (d) => set({ depth: d }),
    setSigma: (s) => set({ sigma: s }),
    setPlayer1: (id) =>
        set((s) => ({
            player1: id,
            view: id !== null && s.player2 !== null ? "path" : "normal",
        })),
    setPlayer2: (id) =>
        set((s) => ({
            player2: id,
            view: id !== null && s.player1 !== null ? "path" : "normal",
        })),
    setMinDistance: (d) => set({ minDistance: d }),
    setView: (s) => set({ view: s }),
    setPath: (s) => set({ path: s }),
    setPathIndex: (s) => set({ pathIndex: s }),
    setNumPaths: (s) => set({ numPaths: s }),
    setCumulativeNodes: (d) => set({ cumulativeNodes: d }),
    setPathNodes: (n) => set({ pathNodes: n }),
    setMinPathDistance: (d) => set({ minPathDistance: d }),
    setPathRangeLow: (d) => set({ pathRangeLow: d }),
    setPathRangeHigh: (d) => set({ minPathDistance: d }),
}));
