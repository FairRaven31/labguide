export const mockCourse = {
  id: 1,
  title: "Electronic Instrumentation Laboratory",
  code: "ENG-101",
  description: "Master the use of industry-standard test equipment.",
  sections: [
    { id: "beginner", name: "Beginner Pedagogy" },
    { id: "intermediate", name: "Intermediate Analysis" },
    { id: "advanced", name: "Advanced Synthesis" },
  ],
  instruments: [
    { id: "osc", name: "Oscilloscope", role: "Time-domain analysis" },
    { id: "dmm", name: "Digital Multimeter", role: "Basic measurements" },
    { id: "fg", name: "Function Generator", role: "Signal creation" },
    { id: "ps", name: "Power Supply", role: "DC Power" },
    { id: "sa", name: "Spectrum Analyzer", role: "Frequency-domain" },
    { id: "vna", name: "Vector Network Analyzer", role: "RF component test" }
  ],
  practicalTasks: [
    { id: 1, title: "Calibrate Probes", status: "pending", mode: "hardware", instrumentIds: ["osc"] },
    { id: 2, title: "Measure 5V DC", status: "completed", mode: "simulator", instrumentIds: ["dmm", "ps"] },
    { id: 3, title: "Generate 1kHz Sine", status: "pending", mode: "hardware", instrumentIds: ["fg", "osc"] }
  ],
  safetyInduction: {
    title: "Hardware Safety Gateway",
    passed: false,
    tasks: [
      { id: "s1", description: "Review ESD precautions" },
      { id: "s2", description: "Locate emergency shutoffs" }
    ]
  },
  capstone: {
    title: "Final Synthesis Capstone",
    tasks: [
      { id: "c1", title: "Build an AM Radio Receiver" }
    ]
  },
  lessons: {
    "osc": { id: "osc", title: "Oscilloscope Simulator Lab", content: "Adjust the timebase and trigger.", is_simulator_lab: true, quizId: "q1", instrument: { id: "osc", name: "Oscilloscope" } },
    "dmm": { id: "dmm", title: "Multimeter Pedagogy", content: "Measure voltage, current, and resistance.", is_simulator_lab: false, quizId: "q2", instrument: { id: "dmm", name: "Digital Multimeter" } },
    "fg": { id: "fg", title: "Function Generator Basics", content: "Synthesize sine, square, and triangle waves.", is_simulator_lab: false, quizId: "q3", instrument: { id: "fg", name: "Function Generator" } },
    "ps": { id: "ps", title: "Power Supply Setup", content: "Set current limits to prevent component burnout.", is_simulator_lab: false, quizId: "q3", instrument: { id: "ps", name: "Power Supply" } },
    "sa": { id: "sa", title: "Spectrum Analyzer Intro", content: "Analyze signals in the frequency domain.", is_simulator_lab: true, quizId: "q4", instrument: { id: "sa", name: "Spectrum Analyzer" } },
    "vna": { id: "vna", title: "VNA Calibration", content: "Perform SOLT calibration.", is_simulator_lab: false, quizId: "q4", instrument: { id: "vna", name: "Vector Network Analyzer" } }
  },
  quizzes: [
    { id: "q1", title: "Oscilloscope Basics", section: "beginner", equipmentIds: ["osc"], subsetSize: 1, outlineNumber: 1, description: "Learn to trigger." },
    { id: "q2", title: "DMM Measurements", section: "beginner", equipmentIds: ["dmm"], subsetSize: 1, outlineNumber: 2, description: "Voltage & current." },
    { id: "q3", title: "Mixed Signals", section: "intermediate", equipmentIds: ["osc", "dmm"], subsetSize: 2, outlineNumber: 3, description: "Debug a circuit." },
    { id: "q4", title: "Advanced RF", section: "advanced", equipmentIds: ["sa", "vna"], subsetSize: 2, outlineNumber: 4, description: "Analyze an amplifier." }
  ],
  decisionTree: {
    questions: [
      { id: "exp", shortName: "Experience", instrumentName: "Background", instrumentId: "exp" },
      { id: "goal", shortName: "Focus", instrumentName: "Primary Goal", instrumentId: "goal" }
    ],
    choices: [
      { id: "beg", label: "Beginner (New to Hardware)", value: "beg" },
      { id: "int", label: "Tinkerer (Hobby Experience)", value: "int" },
      { id: "adv", label: "Engineering Student", value: "adv" },
      { id: "circ", label: "Circuit Design", value: "circ" },
      { id: "sig", label: "Signal Analysis", value: "sig" },
      { id: "mast", label: "General Mastery", value: "mast" }
    ]
  }
};
