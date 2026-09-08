import { create } from "zustand";

export const useStore = create((set) => ({
    selectedPlayer: null,
    depth: 1,
    showEdges: false,
    sigma: null,
    player1: null,
    player2: null,
    minDistance: null,
    view: "normal",
    path: "alt",
    pathIndex: 0,
    numPaths: 0,

    setSelectedPlayer: (id) => set({ selectedPlayer: id }),
    setDepth: (d) => set({ depth: d }),
    setShowEdges: (v) => set({ showEdges: v }),
    setSigma: (s) => set({ sigma: s }),
    setPlayer1: (id) => set({ player1: id }),
    setPlayer2: (id) => set({ player2: id }),
    setMinDistance: (d) => set({ minDistance: d }),
    setView: (s) => set({view: s}),
    setPath: (s) => set({path: s}),
    setPathIndex: (s) => set({pathIndex: s}),
    setNumPaths: (s) => set({numPaths: s}),
}));
