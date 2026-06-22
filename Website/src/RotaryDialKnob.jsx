import React, { useState, useRef, useCallback, useEffect } from "react";

export const RotaryDialKnob = ({ label, minVal = 0, maxVal = 100, onChange }) => {
  const [rotation, setRotation] = useState(0);
  const knobRef = useRef(null);

  // Keep the latest onChange/minVal/maxVal in refs so the drag handlers
  // never close over stale values, without needing to re-subscribe listeners.
  const liveProps = useRef({ onChange, minVal, maxVal });
  useEffect(() => {
    liveProps.current = { onChange, minVal, maxVal };
  }, [onChange, minVal, maxVal]);

  const calculateRotation = useCallback((clientX, clientY) => {
    if (!knobRef.current) return;
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    let angleDeg = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
    if (angleDeg < 0) angleDeg += 360;
    setRotation(angleDeg);

    const { onChange: onChangeNow, minVal: min, maxVal: max } = liveProps.current;
    const scalarValue = min + (angleDeg / 360) * (max - min);
    onChangeNow(Math.round(scalarValue));
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    calculateRotation(e.clientX, e.clientY);

    const handlePointerMove = (moveEvent) => {
      calculateRotation(moveEvent.clientX, moveEvent.clientY);
    };
    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    // Listeners exist ONLY for the duration of this drag, not for the
    // component's whole lifetime.
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }, [calculateRotation]);

  return (
    <div className="flex flex-col items-center select-none w-full h-full">
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        style={{ transform: `rotate(${rotation}deg)`, touchAction: "none" }}
        className="w-full h-full rounded-full border border-white/10 bg-[#09090b] shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_4px_10px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-75"
      >
        <div className="w-1 h-3 bg-emerald-400 rounded-full absolute top-1 shadow-[0_0_8px_#10b981]" />
      </div>
      <span className="text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-wider scale-90">
        {label}
      </span>
    </div>
  );
};
