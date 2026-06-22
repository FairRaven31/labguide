import React, { useState, useRef } from "react";
import { RotaryDialKnob } from "./RotaryDialKnob";

export const ResponsiveHardwareOverlay = ({ lessonId, onTelemetryUpdate }) => {
  const [activeChannel, setActiveChannel] = useState(1);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const containerRef = useRef(null);

  const handleChannelSelect = (channel) => {
    setActiveChannel(channel);
    if(onTelemetryUpdate) onTelemetryUpdate("CHANNEL_SELECT", { active_channel: channel });
  };

  const handlePowerToggle = () => {
    setIsPowerOn(!isPowerOn);
    if(onTelemetryUpdate) onTelemetryUpdate("POWER_STATE", { power: !isPowerOn });
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-[#09090b]/40 backdrop-blur-[12px]">
      
      {/* Underlying Photorealistic Equipment Asset */}
      {/* We use the pre-existing artifact image for the oscilloscope that we generated in Phase 3 */}
      <img
        src="/images/oscilloscope.png"
        alt="Oscilloscope Front Panel"
        className="w-full h-auto block select-none pointer-events-none opacity-90 mix-blend-screen"
      />

      {/* SVG Interaction Layer - Scales with Aspect Ratio */}
      <svg
        viewBox="0 0 1000 600"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      >
        <rect
          x="42"
          y="68"
          width="576"
          height="418"
          rx="8"
          fill="transparent"
          stroke={isPowerOn ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.02)"}
          strokeWidth="4"
          className="transition-all duration-300 pointer-events-auto cursor-pointer"
          onClick={() => handleChannelSelect(0)}
        />

        <circle
          cx="724"
          cy="188"
          r="16"
          className="pointer-events-auto cursor-pointer transition-all duration-150"
          fill={activeChannel === 1 ? "rgba(16, 185, 129, 0.45)" : "rgba(255, 255, 255, 0.02)"}
          stroke={activeChannel === 1 ? "#34d399" : "rgba(255, 255, 255, 0.1)"}
          strokeWidth="2"
          onClick={() => handleChannelSelect(1)}
        />

        <circle
          cx="724"
          cy="234"
          r="16"
          className="pointer-events-auto cursor-pointer transition-all duration-150"
          fill={activeChannel === 2 ? "rgba(16, 185, 129, 0.45)" : "rgba(255, 255, 255, 0.02)"}
          stroke={activeChannel === 2 ? "#34d399" : "rgba(255, 255, 255, 0.1)"}
          strokeWidth="2"
          onClick={() => handleChannelSelect(2)}
        />

        <rect
          x="914"
          y="488"
          width="36"
          height="48"
          rx="4"
          className="pointer-events-auto cursor-pointer fill-transparent stroke-transparent hover:fill-emerald-500/10 hover:stroke-emerald-500/30 transition-all duration-150"
          strokeWidth="1.5"
          onClick={handlePowerToggle}
        />
      </svg>

      <div 
        style={{ left: "71.2%", top: "54.6%", width: "4.8%", height: "8%" }}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <RotaryDialKnob 
          label="Volt/Div" 
          onChange={(val) => { if(onTelemetryUpdate) onTelemetryUpdate("VOLT_DIV", { value: val }); }} 
        />
      </div>

      <div 
        style={{ left: "84.8%", top: "54.6%", width: "4.8%", height: "8%" }}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <RotaryDialKnob 
          label="Time/Div" 
          onChange={(val) => { if(onTelemetryUpdate) onTelemetryUpdate("TIME_DIV", { value: val }); }} 
        />
      </div>
    </div>
  );
};
