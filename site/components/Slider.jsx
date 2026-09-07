import { useStore } from "../src/store.js";

export default function Slider({ max }) {
  const depth = useStore((s) => s.depth);
  return (
    <div className="w-full">
      <input
        className="w-full"
        type="range"
        min={0}
        max={max}
        step={1}
        value={Math.min(depth, max)}
        list="depth-ticks"
        onChange={(e) => useStore.getState().setDepth(Number(e.target.value))}
      />
      <datalist id="depth-ticks">
        {Array.from({ length: max + 1 }, (_, i) => (
          <option key={i} value={i} />
        ))}
      </datalist>
      <div className="depth-labels w-full flex justify-between px-1.5">
        {Array.from({ length: max + 1 }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </div>
  );
}
