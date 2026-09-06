import {create} from 'zustand'

export const useStore = create((set) => ({
    selectedPlayer: null,
    depth: 1,
    showEdges: false,

    setSelectedPlayer: (id) => set({selectedPlayer: id}),
    setDepth: (d) => set({depth: d}),
    setShowEdges: (v) => set({showEdges: v})
}))
