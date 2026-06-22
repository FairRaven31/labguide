import { mockCourse } from "./mockData";

// Simulate network delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Helper for local storage
const loadDB = () => {
  try {
    const data = JSON.parse(localStorage.getItem("labguide_db") || "{}");
    return { learners: {}, attempts: [], instructorApprovals: {}, ...data };
  } catch (e) {
    return { learners: {}, attempts: [], instructorApprovals: {} };
  }
};
const saveDB = (db) => localStorage.setItem("labguide_db", JSON.stringify(db));

export const api = {
  getCourse: async () => {
    await delay(200);
    return mockCourse;
  },

  createLearner: async (data) => {
    await delay(300);
    const db = loadDB();
    const id = "learner_" + Date.now();
    const learner = { id, name: data.name || "Student", hardware_approved: false, safety_passed: false };
    db.learners[id] = learner;
    saveDB(db);
    return { learner };
  },

  getLearner: async (learnerId) => {
    await delay(100);
    const db = loadDB();
    const learner = db.learners[learnerId];
    if (!learner) throw new Error("Learner not found");
    
    // Calculate Lab IQ
    const attempts = db.attempts.filter(a => a.learnerId === learnerId);
    let labIQ = attempts.reduce((acc, a) => acc + (a.score * 10), 0);
    if (learner.safety_passed) labIQ += 500;
    if (learner.hardware_approved) labIQ += 1000;

    const safetyStatus = learner.hardware_approved ? "hardware_approved" : (learner.safety_passed ? "safety_passed" : "simulator_only");

    return {
      learner: { ...learner, labIQ, safetyStatus },
      attempts,
      completedQuizIds: attempts.filter(a => a.passed).map(a => a.quizId)
    };
  },

  getQuiz: async (quizId) => {
    await delay(200);
    const quizMeta = mockCourse.quizzes.find(q => q.id === quizId) || { id: quizId, title: "Custom Quiz" };
    return {
      ...quizMeta,
      questions: [
        { id: 1, text: "What is the primary function of an oscilloscope?", options: ["Measure Voltage over Time", "Measure Resistance", "Generate Signals", "Measure Current directly"], correct_answer: 0 },
        { id: 2, text: "Which parameter controls the horizontal scale?", options: ["Vertical Sensitivity", "Timebase", "Trigger Level", "Bandwidth Limit"], correct_answer: 1 }
      ]
    };
  },

  submitAttempt: async (data) => {
    await delay(300);
    const db = loadDB();
    const score = 100; // Mock score
    const passed = true;
    db.attempts.push({ id: Date.now(), learnerId: data.learnerId, quizId: data.quizId, score, passed, date: new Date().toISOString() });
    saveDB(db);
    return { success: true, score, passed };
  },

  submitPracticalAttempt: async (data) => {
    await delay(300);
    return { success: true, score: 100, passed: true };
  },

  completeSafetyInduction: async (data) => {
    await delay(300);
    const db = loadDB();
    if (db.learners[data.learnerId]) {
      db.learners[data.learnerId].safety_passed = true;
      saveDB(db);
    }
    return { success: true };
  },

  approveHardware: async ({ learnerId }) => {
    await delay(300);
    const db = loadDB();
    if (db.learners[learnerId]) {
      db.learners[learnerId].hardware_approved = true;
      saveDB(db);
    }
    return { success: true };
  },

  startLearningEvent: async () => ({ event_id: "evt_" + Date.now() }),
  completeLearningEvent: async () => ({ success: true }),

  getInstructorOverview: async () => {
    await delay(300);
    const db = loadDB();
    const learners = Object.values(db.learners).map(l => ({
      ...l,
      safetyStatus: l.hardware_approved ? "hardware_approved" : (l.safety_passed ? "safety_passed" : "simulator_only")
    }));
    
    const attempts = db.attempts || [];
    const attemptCount = attempts.length;
    const averageScore = attemptCount > 0 ? (attempts.reduce((acc, a) => acc + a.score, 0) / attemptCount) : 0;
    const hardwareApprovedCount = learners.filter(l => l.hardware_approved).length;

    return {
      learners: learners,
      metrics: {
        learnerCount: learners.length,
        attemptCount: attemptCount,
        averageScore: averageScore,
        safetyCounts: {
          hardware_approved: hardwareApprovedCount
        }
      },
      adaptivityQuality: { matchScore: 92 },
      cohortSkillGaps: [
        { instrument_id: "osc", avg_score: 75, attempt_count: 12 },
        { instrument_id: "vna", avg_score: 60, attempt_count: 5 }
      ],
      remediationSessions: [],
      learningEfficiency: { completionRate: 85 }
    };
  }
};
