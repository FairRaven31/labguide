import os

prompt = """# 🧠 Claude Deep Analysis & System Optimization Prompt

*Copy and paste this entire document directly into Claude 3.5 Sonnet or Opus.*

***

**System Role:** You are an elite Principal AI Architect and Lead Systems Engineer. Your capability matches the deep-reasoning execution of Google DeepMind's Gemini 3.1 Pro (Antigravity). You must evaluate a massive multi-tenant Learning Management System (LMS) codebase that was recently migrated from a local single-file prototype into a full-scale React/FastAPI relational architecture.

## 1. What We Have Built So Far
I am building a 'Full Stack Inventor' LMS platform designed to teach electrical engineering through photorealistic hardware simulation. A highly advanced Gemini 3.1 Pro agent just executed a massive architectural migration.

## 2. Your Task: Deep Critique and Optimization
I need you to systematically review this architecture. You must act as the ultimate safety net and optimizer. Analyze the system and identify:
1. **Issues & Bottlenecks:** What is unrealistic about this architecture? Where will it fail when we scale to 10,000 concurrent students streaming WebSocket telemetry? What are the slow parts?
2. **React Re-render Traps:** Identify potential memory leaks in the `RotaryDialKnob` mouse/touch event listeners and `TanStack Query` invalidation loops.
3. **FastAPI Async Blocking:** Analyze if the current SQLite `WAL` mode is actually sufficient for high-frequency hardware telemetry tracking.

## 3. The Output Format
I need you to guide me exactly like Gemini 3.1 Pro does—systematic, step-by-step, and strictly code-backed. Do not give me generic advice.
*   **Phase 1: The Brutal Truth.** Tell me exactly what is fundamentally weak or unrealistic in the current implementation.
*   **Phase 2: The Optimized Architecture.** Propose the exact infrastructure changes needed.
*   **Phase 3: Code Implementations.** Provide the exact refactored TypeScript/Python code blocks for the most critical optimizations.
*   **Phase 4: Step-by-Step Execution Plan.** Give me a precise, numbered checklist of how to carefully implement your optimizations.

---

## 4. The Codebase Context
Below is the exact code for the current system architecture. Please analyze it deeply.

"""

files = [
    'backend/models.py', 
    'backend/database.py', 
    'backend/main.py', 
    'src/App.jsx', 
    'src/InteractiveWorkspace.jsx', 
    'src/ResponsiveHardwareOverlay.jsx', 
    'src/RotaryDialKnob.jsx'
]

output_path = r'C:\Users\XPS\.gemini\antigravity\brain\85fa5643-0e47-4946-b3df-7965a80b5b07\claude_analysis_prompt.md'

with open(output_path, 'w', encoding='utf-8') as out:
    out.write(prompt)
    for f in files:
        if os.path.exists(f):
            content = open(f, "r", encoding="utf-8").read()
            ext = "python" if f.endswith(".py") else "javascript"
            out.write(f"\n### {f}\n```{ext}\n{content}\n```\n")
        else:
            print(f"File not found: {f}")

print("Successfully generated Claude prompt with appended codebase.")
