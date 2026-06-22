import React, { useState } from "react";
import { ResponsiveHardwareOverlay } from "./ResponsiveHardwareOverlay";

export function InteractiveWorkspace({ lessonId }) {
  return (
    <div className="workspace h-screen w-screen flex flex-col overflow-hidden bg-neutral-950 font-sans">
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md">
        <span className="text-emerald-400 font-mono text-sm tracking-widest uppercase">
          Full Stack Inventor Lab
        </span>
      </header>

      <div className="flex-grow flex flex-col overflow-hidden">
        
        {/* Top Horizontal Split */}
        <div className="flex-grow flex flex-row overflow-hidden">
          
          {/* Left Video Panel */}
          <div className="w-1/2 h-full border-r border-white/5 bg-neutral-900/30 flex flex-col justify-center items-center p-8">
            <div className="w-full aspect-video bg-black rounded-lg border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-900/20 mix-blend-overlay"></div>
              <span className="text-emerald-500/50 mb-4 animate-pulse">LIVE HLS STREAM</span>
              <h2 className="text-white/80 font-mono">Module Video Player</h2>
              <p className="text-white/40 text-sm mt-2">Lesson {lessonId} Introduction</p>
            </div>
          </div>

          <div className="w-[2px] bg-neutral-950 flex-shrink-0" />

          {/* Right Hardware Panel */}
          <div className="w-1/2 h-full bg-neutral-900/10 flex flex-col justify-center items-center p-8 relative">
             <div className="w-full h-full border border-white/10 rounded-lg bg-black/50 overflow-hidden flex items-center justify-center p-4">
                <ResponsiveHardwareOverlay lessonId={lessonId} />
             </div>
          </div>
        </div>

        <div className="h-[2px] bg-neutral-950 flex-shrink-0" />

        {/* Bottom Q&A Panel */}
        <div className="h-64 bg-neutral-950 p-6 flex-shrink-0 overflow-y-auto">
           <h3 className="text-emerald-400 text-sm font-mono uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Technical Q&A Forum</h3>
           <div className="space-y-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-emerald-400 font-bold text-xs">Instructor <span className="opacity-60">(Staff)</span></span>
                   <span className="text-neutral-600 text-[10px]">10:45 AM</span>
                </div>
                <p className="text-neutral-300 text-xs">Remember to set the trigger level to exactly 2.5V when capturing the transient spike.</p>
              </div>
           </div>
        </div>
        
      </div>
    </div>
  );
}
