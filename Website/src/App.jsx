import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BarChart3,
  Beaker,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Compass,
  Cpu,
  Gauge,
  GitBranch,
  GraduationCap,
  Info,
  Activity,
  Layers3,
  Library,
  ListChecks,
  LockKeyhole,
  Play,
  Radio,
  RefreshCcw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Timer,
  UnlockKeyhole,
  UserRound,
  Workflow,
  Zap,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Routes, Route, useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { InteractiveWorkspace } from "./InteractiveWorkspace";
import { api } from "./api";
import { pedagogyData } from "./InstrumentPedagogy";

const learnerKey = "subsetQuizLearnerId";
const planKeyPrefix = "subsetQuizPlan";

function percent(value) {
  return `${Math.round((value || 0) * 100)}%`;
}

function sectionClass(section) {
  return `badge section-${section}`;
}

function byOutline(a, b) {
  return a.outlineNumber - b.outlineNumber;
}

function tagLabel(tag) {
  return tag.replace("instrument:", "").replace("skill:", "").replaceAll("-", " ");
}

function skillLabel(course, tag) {
  return course.skillLabels?.[tag] || tagLabel(tag);
}

function safetyLabel(status) {
  const labels = {
    simulator_only: "Simulator only",
    safety_passed: "Safety passed",
    hardware_approved: "Hardware approved",
  };
  return labels[status] || "Simulator only";
}

function buildSectionLearningPath(course, focusInstrumentIds) {
  const focus = new Set(focusInstrumentIds);
  const hasFocus = focus.size > 0;

  return course.sections.map((section) => {
    const ranked = course.quizzes
      .filter((quiz) => quiz.section === section.id)
      .filter((quiz) => {
        if (!hasFocus) return section.id === "advanced" && quiz.subsetSize === 6;
        return quiz.equipmentIds.some((id) => focus.has(id));
      })
      .map((quiz) => {
        const overlap = quiz.equipmentIds.filter((id) => focus.has(id)).length;
        const allFocusCovered = hasFocus && focusInstrumentIds.every((id) => quiz.equipmentIds.includes(id));
        const focusOnly = hasFocus && quiz.equipmentIds.every((id) => focus.has(id));
        const score = overlap * 20 + (allFocusCovered ? 8 : 0) + (focusOnly ? 4 : 0) - quiz.subsetSize;
        return { quiz, score };
      })
      .sort((a, b) => b.score - a.score || a.quiz.outlineNumber - b.quiz.outlineNumber)
      .map((item) => item.quiz);

    const limit = section.id === "beginner" ? 8 : section.id === "intermediate" ? 6 : 5;
    return {
      ...section,
      quizzes: ranked.slice(0, limit),
    };
  });
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useGsapReveal(deps = []) {
  const scope = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !scope.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.from("[data-gsap='fade-up']", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        clearProps: "transform,opacity",
      });
      gsap.from("[data-gsap='scale-in']", {
        scale: 0.9,
        opacity: 0,
        duration: 1.0,
        stagger: 0.1,
        ease: "power4.out",
        clearProps: "transform,opacity",
      });
      gsap.from("[data-gsap='slide-left']", {
        x: -40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: "power4.out",
        clearProps: "transform,opacity",
      });
      gsap.from("[data-gsap='line']", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      });
    }, scope);

    return () => ctx.revert();
  }, [reduced, ...deps]);

  return scope;
}

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("subsetQuizWorkspace") || "");
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const topbarRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    api
      .getCourse()
      .then(setCourse)
      .catch((err) => setError(err.message));
  }, []);

  function selectMode(nextMode) {
    localStorage.setItem("subsetQuizWorkspace", nextMode);
    setMode(nextMode);
  }

  useEffect(() => {
    if (!mode || reducedMotion || !topbarRef.current) return undefined;
    const tween = gsap.from(topbarRef.current, {
      y: -18,
      opacity: 0,
      duration: 0.56,
      ease: "power3.out",
      clearProps: "transform,opacity",
    });
    return () => tween.kill();
  }, [mode, reducedMotion]);

  return (
    <Routes>
      <Route path="/" element={
        <div className="app-shell">
          <header className="topbar" ref={topbarRef}>
            <div className="brand">
              <div className="brand-mark">
                <Compass size={22} aria-hidden="true" />
              </div>
              <div>
                <strong>Full Stack Inventor</strong>
                <span>Instrumentation mastery</span>
              </div>
            </div>

            {mode && (
              <button className="secondary-action" onClick={() => selectMode("")}>
                Switch Workspace
              </button>
            )}
          </header>

          {error ? <div className="p-8 text-red-500">API unavailable: {error}</div> : null}
          {!course && !error ? <div className="p-8 text-white">Loading course...</div> : null}

          {!mode ? (
            <div className="app-shell portal-shell">
              <RoleGate onSelect={selectMode} />
            </div>
          ) : mode === "learner" && course ? (
            <LearnerWorkspace course={course} />
          ) : mode === "instructor" && course ? (
            <InstructorWorkspace course={course} />
          ) : null}
        </div>
      } />
      <Route path="/course/:courseId/lesson/:lessonId" element={<LessonRouteWrapper />} />
    </Routes>
  );
}

function LessonRouteWrapper() {
  const { lessonId } = useParams();
  return <InteractiveWorkspace lessonId={lessonId} />;
}

function OnboardingSurvey({ onComplete }) {
  const [step, setStep] = useState(0);
  const scope = useGsapReveal([step]);

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => onComplete(), 2500);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <main className="role-gate-premium onboarding-survey" ref={scope}>
      <div className="survey-container" data-gsap="fade-up">
        {step === 0 && (
          <div className="survey-step premium-hero">
            <span className="eyebrow">Personalizing Curriculum</span>
            <h2>What is your current experience level?</h2>
            <div className="survey-options">
              <button className="primary-action" onClick={() => setStep(1)}>Beginner (New to Hardware)</button>
              <button className="primary-action" onClick={() => setStep(1)}>Tinkerer (Some Hobby Experience)</button>
              <button className="primary-action" onClick={() => setStep(1)}>Full Stack Inventor</button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="survey-step premium-hero">
            <span className="eyebrow">Tailoring Focus</span>
            <h2>What is your primary goal?</h2>
            <div className="survey-options">
              <button className="primary-action" onClick={() => setStep(2)}>Circuit Design</button>
              <button className="primary-action" onClick={() => setStep(2)}>Signal Analysis</button>
              <button className="primary-action" onClick={() => setStep(2)}>General Mastery</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="survey-step premium-hero">
            <div className="spinner"><RefreshCcw className="spin-icon" size={48} /></div>
            <h2>Building your custom curriculum...</h2>
            <p>Analyzing knowledge graph and constructing personalized path.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function RoleGate({ onSelect }) {
  const scope = useGsapReveal();
  const [onboardingStep, setOnboardingStep] = useState(null);

  if (onboardingStep !== null) {
    return <OnboardingSurvey onComplete={() => onSelect("learner")} />;
  }

  return (
    <main className="role-gate-premium" ref={scope}>
      <div className="premium-hero" data-gsap="fade-up">
        <div className="brand-mark large">
          <Layers3 size={48} aria-hidden="true" />
        </div>
        <h1>Welcome to LabGuide</h1>
        <p>Master electronic instrumentation with interactive pedagogy and targeted examinations.</p>
      </div>

      <div className="premium-split">
        <button className="premium-card student" data-gsap="scale-in" onClick={() => setOnboardingStep(0)}>
          <div className="card-icon">
            <GraduationCap size={40} aria-hidden="true" />
          </div>
          <h2>Student Portal</h2>
          <p>Access interactive learning modules, complete safety inductions, and take exams tailored to your knowledge gaps.</p>
          <span className="card-action">Enter Student Path <ChevronRight size={18} /></span>
        </button>

        <button className="premium-card instructor" data-gsap="scale-in" onClick={() => onSelect("instructor")}>
          <div className="card-icon">
            <Library size={40} aria-hidden="true" />
          </div>
          <h2>Instructor Console</h2>
          <p>Review student analytics, unlock hardware safety approvals, and manage the underlying instrument pedagogy data.</p>
          <span className="card-action">Enter Console <ChevronRight size={18} /></span>
        </button>
      </div>
    </main>
  );
}

function StatusPanel({ title, body, tone = "neutral" }) {
  return (
    <main className="status-wrap">
      <section className={`status-panel ${tone}`}>
        <Activity size={22} aria-hidden="true" />
        <div>
          <h1>{title}</h1>
          <p>{body}</p>
        </div>
      </section>
    </main>
  );
}

function LearnerWorkspace({ course }) {
  const [learnerData, setLearnerData] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeResult, setActiveResult] = useState(null);
  const [learningPlan, setLearningPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("catalog");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const learner = learnerData?.learner;
  const attempts = learnerData?.attempts || [];
  const practicalAttempts = learnerData?.practicalAttempts || [];
  const learningEvents = learnerData?.learningEvents || [];
  const latestAttempt = learnerData?.latestAttempt;
  const completedIds = new Set(learnerData?.completedQuizIds || []);
  const lessons = course.lessons || {};
  const capstone = course.capstone;
  const planInstrumentIds = learningPlan?.instrumentIds || [];

  useEffect(() => {
    const learnerId = localStorage.getItem(learnerKey);
    if (!learnerId) return;
    setLoading(true);
    api
      .getLearner(learnerId)
      .then((data) => {
        setLearnerData(data);
        const savedPlan = localStorage.getItem(`${planKeyPrefix}:${data.learner.id}`);
        if (savedPlan) {
          const parsed = JSON.parse(savedPlan);
          setLearningPlan(parsed);
          setActiveTab(parsed.instrumentIds[0] || "final");
        }
      })
      .catch(() => localStorage.removeItem(learnerKey))
      .finally(() => setLoading(false));
  }, []);

  async function createLearner(form, plan) {
    setError("");
    setLoading(true);
    try {
      const payload = await api.createLearner(form);
      localStorage.setItem(learnerKey, payload.learner.id);
      localStorage.setItem(`${planKeyPrefix}:${payload.learner.id}`, JSON.stringify(plan));
      setLearningPlan(plan);
      setActiveTab(plan.instrumentIds[0] || "final");
      const data = await api.getLearner(payload.learner.id);
      setLearnerData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshLearner() {
    if (!learner?.id) return;
    const data = await api.getLearner(learner.id);
    setLearnerData(data);
  }

  async function startQuiz(quizId) {
    setError("");
    setActiveResult(null);
    setLoading(true);
    try {
      const quiz = await api.getQuiz(quizId);
      setActiveQuiz(quiz);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitQuiz(quizId, responses) {
    const payload = await api.submitAttempt({
      learnerId: learner.id,
      quizId,
      responses,
    });
    setActiveResult(payload.attempt);
    await refreshLearner();
    return payload.attempt;
  }

  if (activeQuiz) {
    return (
      <QuizRunner
        learner={learner}
        quiz={activeQuiz}
        result={activeResult}
        onBack={() => {
          setActiveQuiz(null);
          setActiveResult(null);
        }}
        onSubmit={submitQuiz}
      />
    );
  }

  if (!learner || !learningPlan) {
    return (
      <StudentPathSetup
        course={course}
        loading={loading}
        error={error}
        onCreate={createLearner}
      />
    );
  }

  return (
    <StudentLearningPlatform
      course={course}
      learner={learner}
      attempts={attempts}
      practicalAttempts={practicalAttempts}
      learningEvents={learningEvents}
      latestAttempt={latestAttempt}
      completedIds={completedIds}
      lessons={lessons}
      capstone={capstone}
      learningPlan={learningPlan}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onStartQuiz={startQuiz}
      onRefresh={refreshLearner}
      onResetPlan={() => {
        localStorage.removeItem(`${planKeyPrefix}:${learner.id}`);
        setLearningPlan(null);
        setActiveTab("");
      }}
    />
  );
}

function StudentPathSetup({ course, loading, error, onCreate }) {
  const scope = useGsapReveal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState(() =>
    Object.fromEntries(course.instruments.map((instrument) => [instrument.id, "new"])),
  );

  const weakInstrumentIds = course.instruments
    .filter((instrument) => answers[instrument.id] !== "confident")
    .map((instrument) => instrument.id);
  const plannedCount = weakInstrumentIds.length;

  function handleSubmit(event) {
    event.preventDefault();
    const plan = {
      createdAt: new Date().toISOString(),
      answers,
      instrumentIds: weakInstrumentIds,
    };
    onCreate({ name, email }, plan);
  }

  return (
    <main className="workspace student-setup" ref={scope}>
      <section className="student-hero panel" data-gsap="fade-up">
        <div>
          <span className="eyebrow">Student Path Builder</span>
          <h1>Tell us what needs teaching first</h1>
          <p>
            The app will hide the full subset bank and build a smaller path from the instruments you are not yet confident using.
          </p>
        </div>
        <div className="path-count">
          <strong>{plannedCount || "Final"}</strong>
          <span>{plannedCount ? "learning tabs" : "exam ready"}</span>
        </div>
      </section>

      <form className="decision-layout" onSubmit={handleSubmit}>
        <section className="panel student-profile-card" data-gsap="slide-left">
          <PanelTitle icon={UserRound} title="Profile" />
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </label>
          <div className="decision-summary">
            <strong>{plannedCount ? `${plannedCount} instruments need learning` : "All instruments marked confident"}</strong>
            <span>{plannedCount ? "Those tabs will become the homepage." : "You will go straight to the final project tab."}</span>
          </div>
          {error ? <p className="inline-error">{error}</p> : null}
          <button className="primary-action" disabled={loading}>
            <Compass size={18} aria-hidden="true" />
            Build Path
          </button>
        </section>

        <section className="panel decision-card" data-gsap="fade-up">
          <PanelTitle icon={GitBranch} title="Decision Tree" />
          <div className="decision-tree">
            {course.decisionTree.questions.map((question) => (
              <div className="decision-question" data-gsap="scale-in" key={question.id}>
                <div>
                  <span>{question.shortName}</span>
                  <strong>{question.instrumentName}</strong>
                </div>
                <div className="decision-options">
                  {course.decisionTree.choices.map((choice) => (
                    <label className={answers[question.instrumentId] === choice.id ? "selected" : ""} key={choice.id}>
                      <input
                        type="radio"
                        name={question.id}
                        value={choice.id}
                        checked={answers[question.instrumentId] === choice.id}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question.instrumentId]: choice.id,
                          }))
                        }
                      />
                      <span>{choice.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </form>
    </main>
  );
}

function StudentLearningPlatform({
  course,
  learner,
  attempts,
  practicalAttempts,
  learningEvents,
  latestAttempt,
  completedIds,
  lessons,
  capstone,
  learningPlan,
  activeTab,
  onTabChange,
  onStartQuiz,
  onRefresh,
  onResetPlan,
}) {
  const scope = useGsapReveal([activeTab, learningPlan.instrumentIds.join("|")]);
  const instrumentIds = learningPlan.instrumentIds;
  const active = activeTab || "overview";
  const practicalTasks = course.practicalTasks || [];
  const safetyInduction = course.safetyInduction;
  const isApproved = learner.safetyStatus === "hardware_approved";
  const completedLessonCount = instrumentIds.filter((id) => completedIds.has(lessons[id]?.quizId)).length;
  const labIQ = 500 + (completedLessonCount * 250) + (practicalAttempts.length * 75) + (isApproved ? 150 : 0);
  const finalComplete = capstone?.quizId ? completedIds.has(capstone.quizId) : false;
  const sectionPath = useMemo(
    () => buildSectionLearningPath(course, instrumentIds),
    [course, instrumentIds.join("|")],
  );

  useEffect(() => {
    if (!learner?.id || active === "overview" || active === "catalog" || active === "library") return undefined;
    const target = active === "final" ? capstone : lessons[active];
    if (!target) return undefined;
    let eventId = "";
    const eventType = active === "final" ? "capstone" : "lesson";
    const title = active === "final" ? capstone.title : `${target.instrument.shortName} lesson`;
    const expectedMinutes = active === "final" ? capstone.expectedMinutes : target.expectedMinutes;

    api
      .startLearningEvent({
        learnerId: learner.id,
        eventType,
        targetId: active,
        title,
        expectedMinutes,
      })
      .then((payload) => {
        eventId = payload.event.id;
      })
      .catch(() => {});

    return () => {
      if (eventId) {
        api.completeLearningEvent({ eventId }).catch(() => {});
      }
    };
  }, [active, learner?.id, capstone, lessons]);

  return (
    <main className="workspace student-platform">
      <section className="student-shell">
        <aside className="student-nav panel" ref={scope} data-gsap="slide-left">
          <div className="student-identity">
            <span className="eyebrow">Student Path</span>
            <h1>{learner.name}</h1>
            <div className="lab-iq-badge">
              <Zap size={15} aria-hidden="true" />
              <strong>{labIQ} Lab IQ</strong>
            </div>
          </div>
          <nav className="lesson-tabs" aria-label="Student lessons">
            <button
              className={active === "catalog" ? "active" : ""}
              data-gsap="scale-in"
              onClick={() => onTabChange("catalog")}
            >
              <Library size={17} aria-hidden="true" />
              <span>Course Catalog</span>
            </button>
            <button
              className={active === "overview" ? "active" : ""}
              data-gsap="scale-in"
              onClick={() => onTabChange("overview")}
            >
              <Compass size={17} aria-hidden="true" />
              <span>Path Overview</span>
            </button>
            <button
              className={active === "library" ? "active" : ""}
              data-gsap="scale-in"
              onClick={() => onTabChange("library")}
            >
              <BookOpen size={17} aria-hidden="true" />
              <span>University Library</span>
            </button>
            {instrumentIds.map((instrumentId) => {
              const lesson = lessons[instrumentId];
              const done = completedIds.has(lesson.quizId);
              return (
                <button
                  className={active === instrumentId ? "active" : ""}
                  data-gsap="scale-in"
                  onClick={() => isApproved && onTabChange(instrumentId)}
                  key={instrumentId}
                  disabled={!isApproved}
                >
                  {isApproved ? <Radio size={17} aria-hidden="true" /> : <LockKeyhole size={17} aria-hidden="true" />}
                  <span>{lesson.instrument.name}</span>
                  {done ? <CheckCircle2 size={16} aria-hidden="true" /> : null}
                </button>
              );
            })}
            <button
              className={active === "final" ? "active final-tab" : "final-tab"}
              data-gsap="scale-in"
              onClick={() => isApproved && onTabChange("final")}
              disabled={!isApproved}
            >
              {isApproved ? <Beaker size={17} aria-hidden="true" /> : <LockKeyhole size={17} aria-hidden="true" />}
              <span>Final Project</span>
              {finalComplete ? <CheckCircle2 size={16} aria-hidden="true" /> : null}
            </button>
          </nav>
          <StudentProgressRail
            completedLessonCount={completedLessonCount}
            totalLessons={instrumentIds.length}
            latestAttempt={latestAttempt}
            attempts={attempts}
          />
          <button className="secondary-action reset-path" onClick={onResetPlan}>
            <RotateCcw size={17} aria-hidden="true" />
            Rebuild Path
          </button>
        </aside>

        <main className="workspace-main">
          {active === "catalog" && <CourseCatalog />}
          {active === "library" && <UniversityLibraryTab />}
          {active === "overview" && (
            <>
              <AchievementsPanel isApproved={isApproved} completedLessonCount={completedLessonCount} />
              {!isApproved ? (
                <div className="gateway-warning" data-gsap="fade-up">
                  <LockKeyhole size={24} aria-hidden="true" />
                  <div>
                    <strong>Safety Gateway Locked</strong>
                    <p>You must complete the safety induction and simulator tasks below, and receive instructor approval before accessing the instruments.</p>
                  </div>
                </div>
              ) : null}
              <SafetyPracticePanel
                course={course}
                learner={learner}
                activeTab={active}
                safetyInduction={safetyInduction}
                tasks={practicalTasks}
                practicalAttempts={practicalAttempts}
                learningEvents={learningEvents}
                onRefresh={onRefresh}
              />
              {isApproved ? (
                <SectionLearningPath
                  path={sectionPath}
                  completedIds={completedIds}
                  onStartQuiz={onStartQuiz}
                />
              ) : null}
            </>
          )}
          {active === "final" && (
            <FinalProjectTab
              capstone={capstone}
              completedLessonCount={completedLessonCount}
              totalLessons={instrumentIds.length}
              finalComplete={finalComplete}
              onStartQuiz={onStartQuiz}
            />
          )}
          {![ "catalog", "overview", "library", "final" ].includes(active) && (
            <InstrumentLessonTab
              lesson={lessons[active]}
              completed={completedIds.has(lessons[active]?.quizId)}
              onStartQuiz={onStartQuiz}
            />
          )}
        </main>
      </section>
    </main>
  );
}

function CourseCatalog() {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => fetch("http://127.0.0.1:8010/api/courses").then(res => res.json())
  });

  if (isLoading) return <div className="p-8 text-emerald-500 animate-pulse font-mono">Syncing Multi-Tenant Curriculum Database...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load courses from DB.</div>;

  return (
    <section className="learning-module">
      <header className="module-header">
        <div className="module-title">
          <h2>University Course Catalog</h2>
          <p>Select a course to launch the interactive Coursera-style split-pane laboratory.</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {courses && courses.map(course => (
          <div key={course.id} className="border border-white/10 rounded-lg p-6 bg-black/40 backdrop-blur-md hover:border-emerald-500/50 transition-colors">
            <h3 className="text-xl font-bold text-white mb-2">{course.code}: {course.title}</h3>
            <p className="text-neutral-400 text-sm mb-6 h-10">{course.description}</p>
            
            <div className="space-y-2">
              <h4 className="text-xs text-emerald-500 font-mono uppercase tracking-wider mb-2">Modules</h4>
              {course.modules && course.modules.map(module => (
                <div key={module.id} className="bg-white/5 rounded p-3">
                  <p className="text-sm text-neutral-200 font-bold mb-2">{module.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {module.lessons && module.lessons.map(lesson => (
                      <Link 
                        key={lesson.id} 
                        to={`/course/${course.id}/lesson/${lesson.id}`}
                        className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/30 transition-colors"
                      >
                        {lesson.title} {lesson.is_simulator_lab && '🔬'}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {(!course.modules || course.modules.length === 0) && (
                <p className="text-xs text-neutral-500">No interactive modules loaded yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StudentProgressRail({ completedLessonCount, totalLessons, latestAttempt, attempts }) {
  const percentDone = totalLessons ? completedLessonCount / totalLessons : 1;
  return (
    <div className="student-progress">
      <div className="progress-item">
        <div>
          <span>Lesson exams</span>
          <strong>
            {completedLessonCount}/{totalLessons}
          </strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${percentDone * 100}%` }} />
        </div>
      </div>
      <div className="theta-box">
        <span>Latest result</span>
        <strong>{latestAttempt ? latestAttempt.levelLabel : "Not tested"}</strong>
        <small>{latestAttempt ? `score ${percent(latestAttempt.score)} - theta ${latestAttempt.theta}` : `${attempts.length} attempts so far`}</small>
      </div>
    </div>
  );
}

function SafetyPracticePanel({
  course,
  learner,
  activeTab,
  safetyInduction,
  tasks,
  practicalAttempts,
  learningEvents,
  onRefresh,
}) {
  const [busyTask, setBusyTask] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const safetyStatus = learner?.safetyStatus || "simulator_only";
  const latestByTask = useMemo(() => {
    const map = new Map();
    practicalAttempts.forEach((attempt) => {
      if (!map.has(attempt.taskId)) map.set(attempt.taskId, attempt);
    });
    return map;
  }, [practicalAttempts]);

  const visibleTasks = useMemo(() => {
    if (activeTab === "final") {
      return tasks.filter((task) => task.mode === "hardware" || (task.instrumentIds?.length || 0) > 1).slice(0, 3);
    }
    return tasks.filter((task) => task.instrumentIds?.includes(activeTab)).slice(0, 3);
  }, [activeTab, tasks]);

  const completedMinutes = learningEvents
    .filter((event) => event.durationSeconds)
    .reduce((total, event) => total + event.durationSeconds / 60, 0);

  async function completeSafety() {
    setError("");
    setMessage("");
    setBusyTask("safety");
    try {
      await api.completeSafetyInduction({ learnerId: learner.id });
      setMessage("Safety induction marked complete. Hardware still needs instructor approval.");
      await onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyTask("");
    }
  }

  async function runPractical(task) {
    setError("");
    setMessage("");
    setBusyTask(task.id);
    try {
      const payload = await api.submitPracticalAttempt({
        learnerId: learner.id,
        taskId: task.id,
        useSample: true,
      });
      setMessage(`${task.title}: ${payload.attempt.passed ? "passed" : "needs review"} at ${percent(payload.attempt.score)}.`);
      await onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyTask("");
    }
  }

  return (
    <section className="panel safety-practice-panel" data-gsap="fade-up">
      <div className="safety-practice-head">
        <PanelTitle icon={ShieldCheck} title="Safety and Simulator Tasks" />
        <div className={`safety-state ${safetyStatus}`}>
          {safetyStatus === "hardware_approved" ? <UnlockKeyhole size={16} aria-hidden="true" /> : <LockKeyhole size={16} aria-hidden="true" />}
          {safetyLabel(safetyStatus)}
        </div>
      </div>

      <div className="safety-grid">
        <article className="safety-card">
          <div>
            <span className="eyebrow">{safetyInduction?.expectedMinutes || 7} min induction</span>
            <strong>{safetyInduction?.title || "Bench Safety Induction"}</strong>
            <p>{safetyInduction?.summary}</p>
          </div>
          <div className="safety-checks">
            {(safetyInduction?.checklist || []).slice(0, 3).map((item) => (
              <span key={item}>
                <CheckCircle2 size={14} aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
          <button
            className="secondary-action"
            disabled={busyTask === "safety" || safetyStatus !== "simulator_only"}
            onClick={completeSafety}
          >
            <ShieldCheck size={17} aria-hidden="true" />
            {safetyStatus === "simulator_only" ? "Complete Safety" : "Safety Complete"}
          </button>
        </article>

        <article className="safety-card time-card">
          <div>
            <span className="eyebrow">Learning efficiency</span>
            <strong>{completedMinutes ? `${Math.round(completedMinutes)} min logged` : "Timer armed"}</strong>
            <p>Lesson time is compared with benchmark times for instructor analytics.</p>
          </div>
          <div className="time-dials">
            <span>
              <Timer size={15} aria-hidden="true" />
              {learningEvents.length} events
            </span>
            <span>
              <Zap size={15} aria-hidden="true" />
              Practical score tracked
            </span>
          </div>
        </article>
      </div>

      {message ? <p className="inline-success">{message}</p> : null}
      {error ? <p className="inline-error">{error}</p> : null}

      <div className="practical-task-grid">
        {visibleTasks.map((task) => {
          const latest = latestByTask.get(task.id);
          const locked = task.mode === "hardware" && safetyStatus !== "hardware_approved";
          return (
            <article className="practical-task-card" data-gsap="scale-in" key={task.id}>
              <div className="task-topline">
                <span className={`task-mode ${task.mode}`}>{task.mode}</span>
                <span>{task.expectedMinutes} min</span>
              </div>
              <strong>{task.title}</strong>
              <p>{task.scenario}</p>
              <div className="skill-strip">
                {task.skills.slice(0, 3).map((skill) => (
                  <span key={skill}>{skillLabel(course, skill)}</span>
                ))}
              </div>
              {latest ? (
                <div className="task-result">
                  <ScorePill score={latest.score} />
                  <span>{latest.passed ? "Passed" : "Needs review"}</span>
                </div>
              ) : null}
              <button
                className={task.mode === "hardware" ? "secondary-action" : "primary-action"}
                disabled={busyTask === task.id || locked}
                onClick={() => runPractical(task)}
              >
                {task.mode === "hardware" ? <LockKeyhole size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
                {locked ? "Instructor Approval Needed" : task.mode === "hardware" ? "Run Hardware Check" : "Run Simulator"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SectionLearningPath({ path, completedIds, onStartQuiz }) {
  const scope = useGsapReveal([path.map((section) => section.quizzes.map((quiz) => quiz.id).join(",")).join("|")]);

  return (
    <section className="panel section-path-panel" ref={scope} data-gsap="fade-up">
      <div className="section-path-head">
        <PanelTitle icon={Layers3} title="Learning Path Sections" />
        <span>Beginner: 1-2 instruments | Intermediate: 3-4 | Advanced: 5-6</span>
      </div>
      <div className="section-path-grid">
        {path.map((section) => (
          <div className={`path-section path-${section.id}`} data-gsap="scale-in" key={section.id}>
            <div className="path-section-title">
              <span className={sectionClass(section.id)}>{section.name}</span>
              <strong>{section.sizes.join("-")} instruments</strong>
            </div>
            <p>{section.description}</p>
            {section.quizzes.length ? (
              <div className="path-course-list">
                {section.quizzes.map((quiz) => (
                  <article className="path-course" data-gsap="fade-up" key={quiz.id}>
                    <div>
                      <span className="outline-number">{quiz.outlineNumber}</span>
                      <strong>{quiz.title}</strong>
                    </div>
                    <div className="equipment-strip">
                      {quiz.equipment.map((item) => (
                        <span key={item.id}>{item.shortName}</span>
                      ))}
                    </div>
                    <button className="mini-chip" onClick={() => onStartQuiz(quiz.id)}>
                      {completedIds.has(quiz.id) ? <CheckCircle2 size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
                      {completedIds.has(quiz.id) ? "Review" : "Start"}
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="No section labs needed" body="Your decision-tree answers did not require this level." />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function InteractiveHardwarePanel({ instrumentId }) {
  const [activeHotspot, setActiveHotspot] = useState(null);

  const hotspots = [
    { id: 1, top: '30%', left: '25%', title: 'Main Display Canvas', description: 'Renders the real-time measurement data, waveforms, or Smith charts with extremely high resolution.' },
    { id: 2, top: '55%', left: '75%', title: 'Rotary Control Knob', description: 'Used to precisely adjust trigger levels, timebase sweeping, or voltage amplitude scales.' },
    { id: 3, top: '80%', left: '45%', title: 'Hardware I/O Ports', description: 'Connect your BNC probes, RF cables, or test leads directly into these heavily shielded ports.' },
  ];

  return (
    <div className="interactive-hardware-container">
      <div className="hardware-image-wrapper">
         <div className="photorealistic-hardware-display">
             <div className="mesh-gradient-bg"></div>
             
             {/* Actual High-Res Photorealistic Instrument Image */}
             <img 
               src={`/images/${
                 instrumentId.toLowerCase().includes('network') ? 'network-analyzer' :
                 instrumentId.toLowerCase().includes('spectrum') ? 'spectrum-analyzer' :
                 instrumentId.toLowerCase().includes('power') ? 'power-supply' :
                 instrumentId.toLowerCase().includes('function') ? 'function-generator' :
                 instrumentId.toLowerCase().includes('multimeter') ? 'multimeter' :
                 instrumentId.toLowerCase().includes('oscilloscope') ? 'oscilloscope' :
                 'oscilloscope' // fallback
               }.png`} 
               alt={instrumentId} 
               className="hardware-photorealistic-img"
             />
             
             {hotspots.map(spot => (
               <div 
                 key={spot.id}
                 className="hotspot-dot" 
                 style={{ top: spot.top, left: spot.left }}
                 onMouseEnter={() => setActiveHotspot(spot)}
                 onMouseLeave={() => setActiveHotspot(null)}
               >
                 <div className="hotspot-pulse"></div>
               </div>
             ))}
         </div>
      </div>
      
      <div className={`hotspot-tooltip ${activeHotspot ? 'visible' : ''}`}>
        {activeHotspot ? (
          <>
            <h4>{activeHotspot.title}</h4>
            <p>{activeHotspot.description}</p>
          </>
        ) : (
          <p className="tooltip-idle">Hover over the glowing pulsing hotspots to explore the physical hardware interface.</p>
        )}
      </div>
    </div>
  );
}

function InstrumentLessonTab({ lesson, completed, onStartQuiz }) {
  const [activeModule, setActiveModule] = useState("simulator");
  const scope = useGsapReveal([lesson, activeModule]);

  if (!lesson) {
    return <EmptyState title="Lesson missing" body="Rebuild the path to regenerate this tab." />;
  }

  const markdownContent = pedagogyData[lesson.instrument.id]?.[activeModule] || "";

  return (
    <article className="coursera-course-layout" ref={scope}>
      
      {/* LEFT SIDEBAR: Course Modules */}
      <aside className="course-sidebar panel" data-gsap="fade-up">
        <h2 className="course-title">{lesson.instrument.name}</h2>
        <span className="course-eyebrow">Interactive Masterclass</span>
        
        <nav className="course-module-list">
          <button 
            className={`module-btn ${activeModule === "simulator" ? "active" : ""}`} 
            onClick={() => setActiveModule("simulator")}
          >
            <div className="module-icon"><Cpu size={16}/></div>
            <div className="module-text">
              <strong>1. Hardware Simulator</strong>
              <span>Figma-style Hotspots</span>
            </div>
          </button>

          <button 
            className={`module-btn ${activeModule === "beginner" ? "active" : ""}`} 
            onClick={() => setActiveModule("beginner")}
          >
            <div className="module-icon"><BookOpen size={16}/></div>
            <div className="module-text">
              <strong>2. Fundamentals</strong>
              <span>Beginner Theory</span>
            </div>
          </button>

          <button 
            className={`module-btn ${activeModule === "intermediate" ? "active" : ""}`} 
            onClick={() => setActiveModule("intermediate")}
          >
            <div className="module-icon"><Workflow size={16}/></div>
            <div className="module-text">
              <strong>3. Setup & Operations</strong>
              <span>Intermediate Guide</span>
            </div>
          </button>

          <button 
            className={`module-btn ${activeModule === "advanced" ? "active" : ""}`} 
            onClick={() => setActiveModule("advanced")}
          >
            <div className="module-icon"><Layers3 size={16}/></div>
            <div className="module-text">
              <strong>4. Advanced Analytics</strong>
              <span>Specs & External Manuals</span>
            </div>
          </button>
        </nav>

        <div className="course-quiz-container">
           <button className="primary-action quiz-action-btn" onClick={() => onStartQuiz(lesson.quizId)}>
            {completed ? <RefreshCcw size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            {completed ? "Retake Final Exam" : "Take Final Exam"}
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CANVAS: Active Module Content */}
      <main className="course-main-canvas panel" data-gsap="scale-in">
        {activeModule === "simulator" ? (
          <div className="simulator-view">
             <h2 className="simulator-h2">Interactive Hardware Simulator</h2>
             <p className="simulator-p">Before reading the theory, familiarize yourself with the physical layout of the {lesson.instrument.shortName}.</p>
             <InteractiveHardwarePanel instrumentId={lesson.instrument.name} />
          </div>
        ) : (
          <div className="markdown-canvas">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        )}
      </main>

    </article>
  );
}

function InstrumentVisualization({ visualization }) {
  const signals = visualization.signals || [];
  return (
    <div className={`visualization-board viz-${visualization.type}`}>
      <div className="viz-canvas" aria-hidden="true">
        <span className="viz-line one" />
        <span className="viz-line two" />
        <span className="viz-node node-a" />
        <span className="viz-node node-b" />
        <span className="viz-node node-c" />
        <span className="viz-sweep" />
      </div>
      <div>
        <strong>{visualization.title}</strong>
        <p>{visualization.caption}</p>
      </div>
      <div className="signal-tags">
        {signals.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
    </div>
  );
}

function UniversityLibraryTab() {
  const [content, setContent] = useState("Loading massive curriculum data from server...");

  useEffect(() => {
    fetch("http://127.0.0.1:8010/api/curriculum")
      .then(res => res.json())
      .then(data => {
        if (data.content) setContent(data.content);
        else setContent("Failed to load curriculum: " + data.error);
      })
      .catch(err => setContent("Error loading curriculum API."));
  }, []);

  return (
    <div className="panel library-panel" data-gsap="fade-up">
       <PanelTitle icon={BookOpen} title="Master University Curriculum (500+ Pages)" />
       <div className="markdown-canvas" style={{ maxWidth: '900px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.9' }}>
           <ReactMarkdown>{content}</ReactMarkdown>
       </div>
    </div>
  );
}

function FinalProjectTab({ capstone, completedLessonCount, totalLessons, finalComplete, onStartQuiz }) {
  const scope = useGsapReveal([completedLessonCount, totalLessons, finalComplete ? "done" : "open"]);
  const ready = completedLessonCount >= totalLessons;
  return (
    <article className="lesson-page" ref={scope}>
      <section className="panel capstone-hero" data-gsap="fade-up">
        <div>
          <span className="eyebrow">Final Examination</span>
          <h1>{capstone.title}</h1>
          <p>{capstone.summary}</p>
        </div>
        <button className="primary-action" disabled={!ready} onClick={() => onStartQuiz(capstone.quizId)}>
          {finalComplete ? <RefreshCcw size={18} aria-hidden="true" /> : <Beaker size={18} aria-hidden="true" />}
          {ready ? (finalComplete ? "Retake Final" : "Start Final") : "Complete Lessons"}
        </button>
      </section>

      <section className="panel capstone-scenario" data-gsap="fade-up">
        <PanelTitle icon={Beaker} title="Case Study" />
        <p>{capstone.scenario}</p>
        {!ready ? (
          <div className="readiness-callout">
            <strong>Final locked</strong>
            <span>
              Complete {Math.max(totalLessons - completedLessonCount, 0)} more lesson exam
              {Math.max(totalLessons - completedLessonCount, 0) === 1 ? "" : "s"} first.
            </span>
          </div>
        ) : null}
      </section>

      <section className="capstone-grid">
        {capstone.stages.map((stage, index) => (
          <div className="panel capstone-stage" data-gsap="scale-in" style={{ "--card-index": index }} key={stage.title}>
            <span className="outline-number">{index + 1}</span>
            <h3>{stage.title}</h3>
            <p>{stage.task}</p>
            <div className="equipment-strip">
              {stage.equipmentIds.map((id) => {
                const instrument = capstone.equipment.find((item) => item.id === id);
                return <span key={id}>{instrument?.shortName || id}</span>;
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="panel" data-gsap="fade-up">
        <PanelTitle icon={ClipboardList} title="Deliverables" />
        <div className="deliverable-list">
          {capstone.deliverables.map((deliverable) => (
            <span key={deliverable}>{deliverable}</span>
          ))}
        </div>
      </section>
    </article>
  );
}

function AchievementsPanel({ isApproved, completedLessonCount }) {
  const achievements = [
    { id: "safety", icon: ShieldCheck, title: "Safety First", active: isApproved, desc: "Hardware access approved" },
    { id: "first_blood", icon: Zap, title: "First Blood", active: completedLessonCount >= 1, desc: "Passed first exam" },
    { id: "master", icon: Award, title: "Halfway There", active: completedLessonCount >= 3, desc: "Passed 3 exams" }
  ];

  return (
    <section className="panel achievements-panel" data-gsap="fade-up">
      <PanelTitle icon={Award} title="Lab Achievements" />
      <div className="badges-grid">
        {achievements.map(badge => {
          const Icon = badge.icon;
          return (
            <div key={badge.id} className={`badge-card ${badge.active ? 'unlocked' : 'locked'}`}>
              <div className="badge-icon"><Icon size={24} aria-hidden="true" /></div>
              <div>
                <strong>{badge.title}</strong>
                <span>{badge.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <span>{body}</span>
    </div>
  );
}

function PanelTitle({ icon: Icon, title }) {
  return (
    <div className="panel-title">
      <Icon size={19} aria-hidden="true" />
      <h2>{title}</h2>
    </div>
  );
}

function ScorePill({ score }) {
  const isHigh = score > 0.8;
  const isMed = score > 0.5 && !isHigh;
  const isLow = score <= 0.5;

  return (
    <div className={`score-pill ${isHigh ? "high" : isMed ? "med" : isLow ? "low" : ""}`}>
      {percent(score)}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function QuizRunner({ learner, quiz, result, onBack, onSubmit }) {
  const scope = useGsapReveal([quiz.id, result?.id || "answering"]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const unanswered = quiz.questions.filter((question) => !answers[question.id]).length;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(quiz.id, answers);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="workspace">
      <section className={`quiz-runner ${quiz.id === "onboarding" ? "onboarding-runner" : "platform-runner"}`} ref={scope}>
        <button className="ghost-action" data-gsap="slide-left" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          Dashboard
        </button>

        <div className="quiz-header panel" data-gsap="fade-up">
          <div>
            <span className="eyebrow">{quiz.id === "onboarding" ? "Diagnostic" : quiz.sectionName}</span>
            <h1>{quiz.title}</h1>
            <p>{quiz.summary}</p>
          </div>
          <div className="quiz-meta">
            <Metric label="Questions" value={quiz.questions.length} />
            <Metric label="Subset size" value={quiz.subsetSize} />
            <Metric label="Learner" value={learner?.name || "Guest"} />
          </div>
        </div>

        {result ? (
          <ResultPanel result={result} onBack={onBack} />
        ) : (
          <form className="question-stack" onSubmit={handleSubmit}>
            {quiz.questions.map((question, index) => (
              <fieldset className="question-panel panel" data-gsap="fade-up" key={question.id}>
                <legend>
                  <span>{index + 1}</span>
                  {question.stem}
                </legend>
                <div className="choice-list">
                  {question.choices.map((choice) => (
                    <label className={answers[question.id] === choice.id ? "selected" : ""} key={choice.id}>
                      <input
                        type="radio"
                        name={question.id}
                        value={choice.id}
                        checked={answers[question.id] === choice.id}
                        onChange={() => setAnswers((current) => ({ ...current, [question.id]: choice.id }))}
                      />
                      <span>{choice.text}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <div className="submit-bar">
              <span>{unanswered ? `${unanswered} unanswered` : "Ready to submit"}</span>
              <button className="primary-action" disabled={unanswered > 0 || submitting}>
                <CheckCircle2 size={18} aria-hidden="true" />
                Submit
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

function ResultPanel({ result, onBack }) {
  const competencies = Object.entries(result.competencies || {}).filter(([tag]) => tag.startsWith("instrument:"));

  return (
    <section className="panel result-panel" data-gsap="scale-in">
      <div className="result-top">
        <div>
          <span className="eyebrow">Result</span>
          <h2>
            {result.correctCount}/{result.totalCount} correct
          </h2>
        </div>
        <ScorePill score={result.score} />
      </div>
      <div className="metric-row">
        <Metric label="IRT theta" value={result.theta} />
        <Metric label="Mastery" value={percent(result.mastery)} />
        <Metric label="Level" value={result.levelLabel} />
      </div>
      <div className="competency-grid">
        {competencies.map(([tag, item]) => (
          <div className="competency" key={tag}>
            <span>{tag.replace("instrument:", "").replaceAll("-", " ")}</span>
            <strong>{percent(item.mastery)}</strong>
          </div>
        ))}
      </div>
      <button className="primary-action" onClick={onBack}>
        <ArrowLeft size={18} aria-hidden="true" />
        Return
      </button>
    </section>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="segmented-control" style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: "8px" }}>
      {options.map(([optValue, label]) => (
        <button
          key={optValue}
          onClick={() => onChange(optValue)}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            background: value === optValue ? "rgba(16, 185, 129, 0.2)" : "transparent",
            color: value === optValue ? "#10b981" : "#a3a3a3",
            border: "none",
            cursor: "pointer",
            fontWeight: value === optValue ? "600" : "400"
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function InstructorWorkspace({ course }) {
  const [overview, setOverview] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [section, setSection] = useState("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const scope = useGsapReveal([overview?.metrics?.attemptCount || 0, activeQuiz?.id || "none", section, query]);

  async function loadOverview() {
    setError("");
    try {
      const payload = await api.getInstructorOverview();
      setOverview(payload);
    } catch (err) {
      setError(err.message);
    }
  }

  async function previewQuiz(quizId) {
    setError("");
    try {
      const quiz = await api.getQuiz(quizId, true);
      setActiveQuiz(quiz);
    } catch (err) {
      setError(err.message);
    }
  }

  async function approveHardware(learnerId) {
    setError("");
    try {
      await api.approveHardware({ learnerId });
      await loadOverview();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  const quizzes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return course.quizzes
      .filter((quiz) => section === "all" || quiz.section === section)
      .filter((quiz) => {
        if (!normalized) return true;
        return `${quiz.title} ${quiz.summary}`.toLowerCase().includes(normalized);
      })
      .sort(byOutline);
  }, [course.quizzes, query, section]);

    return (
      <main className="workspace" ref={scope}>
      <div className="ambient-orb instructor-orb-1"></div>
      <div className="ambient-orb instructor-orb-2"></div>
      
      <div className="command-center-header" data-gsap="fade-up">
         <div>
            <span className="eyebrow">Instructor Command Center</span>
            <h1>Live Lab Telemetry & Analytics</h1>
         </div>
         <button className="primary-action" onClick={loadOverview}>
           <RefreshCcw size={17} aria-hidden="true" />
           Sync Database
         </button>
      </div>

      {error ? <p className="inline-error">{error}</p> : null}

      <section className="command-center-metrics" data-gsap="fade-up">
        <StatCard icon={UserRound} label="Active Inventors" value={overview?.metrics.learnerCount || 0} />
        <StatCard icon={ListChecks} label="Total Quiz Attempts" value={overview?.metrics.attemptCount || 0} />
        <StatCard icon={ShieldCheck} label="Hardware Approved" value={overview?.metrics.safetyCounts?.hardware_approved || 0} />
        <StatCard icon={BarChart3} label="Global Average" value={percent(overview?.metrics.averageScore || 0)} />
        <StatCard icon={Gauge} label="AI Adaptivity" value={percent(overview?.adaptivityQuality?.matchScore || 0)} />
      </section>

      <section className="workspace-grid instructor-grid">
        <div className="left-column">
          <LiveHardwareTelemetryPanel />

          <PendingApprovalsPanel overview={overview} approveHardware={approveHardware} />

          <InstructorAnalyticsPanel course={course} overview={overview} />

          <section className="panel" data-gsap="fade-up">
            <PanelTitle icon={UserRound} title="Learners" />
            {overview?.learners?.length ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Attempts</th>
                      <th>Average</th>
                      <th>Latest</th>
                      <th>Level</th>
                      <th>Safety</th>
                      <th>Hardware</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.learners.map((learner) => (
                      <tr key={learner.id}>
                        <td>
                          <strong>{learner.name}</strong>
                          <span>{learner.email}</span>
                        </td>
                        <td>{learner.attemptCount}</td>
                        <td>{percent(learner.averageScore)}</td>
                        <td>{learner.latestAttempt?.quizTitle || "None"}</td>
                        <td>{learner.latestAttempt?.levelLabel || "New"}</td>
                        <td>
                          <span className={`safety-state table-state ${learner.safetyStatus}`}>
                            {safetyLabel(learner.safetyStatus)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="mini-chip"
                            disabled={learner.safetyStatus !== "safety_passed"}
                            onClick={() => approveHardware(learner.id)}
                          >
                            {learner.safetyStatus === "hardware_approved" ? "Approved" : learner.safetyStatus === "safety_passed" ? "Approve" : "Safety first"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No learners" body="Learner records appear after registration." />
            )}
          </section>

          <section className="panel" data-gsap="fade-up">
            <div className="panel-toolbar">
              <PanelTitle icon={ListChecks} title="Quiz Bank" />
              <div className="search-box">
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search quizzes" />
              </div>
            </div>
            <div className="filter-row">
              <Segmented
                value={section}
                onChange={setSection}
                options={[
                  ["all", "All"],
                  ["beginner", "Beginner"],
                  ["intermediate", "Intermediate"],
                  ["advanced", "Advanced"],
                ]}
              />
            </div>
            <div className="bank-list">
              {quizzes.map((quiz) => (
                <div className="bank-row" data-gsap="fade-up" key={quiz.id}>
                  <div>
                    <span className="outline-number">{quiz.outlineNumber}</span>
                    <strong>{quiz.title}</strong>
                    <span>{quiz.questionCount} questions</span>
                  </div>
                  <span className={sectionClass(quiz.section)}>{quiz.sectionName}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function LiveHardwareTelemetryPanel() {
  const instruments = [
    { id: 'oscilloscope', name: 'R&S® RTB2000 Oscilloscope', status: 'ONLINE', usage: '82%' },
    { id: 'spectrum-analyzer', name: 'R&S® FPC1500 Spectrum Analyzer', status: 'ONLINE', usage: '45%' },
    { id: 'network-analyzer', name: 'R&S® ZND Vector Network Analyzer', status: 'STANDBY', usage: '0%' },
    { id: 'power-supply', name: 'R&S® NGE100 Power Supply', status: 'ONLINE', usage: '95%' },
    { id: 'multimeter', name: 'R&S® HMC8012 Digital Multimeter', status: 'ONLINE', usage: '60%' },
    { id: 'function-generator', name: 'R&S® HMF2550 Function Generator', status: 'MAINTENANCE', usage: 'N/A' },
  ];

  return (
    <section className="panel telemetry-panel" data-gsap="fade-up">
      <PanelTitle icon={Cpu} title="Live Lab Hardware Telemetry" />
      <div className="telemetry-grid">
        {instruments.map(inst => (
          <div key={inst.id} className={`telemetry-card ${inst.status.toLowerCase()}`}>
            <div className="telemetry-info">
              <strong>{inst.name}</strong>
              <div className="telemetry-stats">
                <span className={`status-badge ${inst.status.toLowerCase()}`}>
                  {inst.status}
                </span>
                <span className="usage-meter">Load: {inst.usage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PendingApprovalsPanel({ overview, approveHardware }) {
  const pending = (overview?.learners || []).filter(l => l.safetyStatus === "safety_passed");
  
  if (pending.length === 0) return null;

  return (
    <section className="panel pending-approvals" data-gsap="fade-up">
      <div className="approvals-header">
        <PanelTitle icon={ShieldCheck} title="Pending Hardware Approvals" />
        <span className="badge">{pending.length} Action{pending.length !== 1 ? 's' : ''} Required</span>
      </div>
      <div className="approvals-list">
        {pending.map(learner => (
          <div key={learner.id} className="approval-card">
            <div className="approval-info">
              <strong>{learner.name}</strong>
              <span>Has completed all safety and simulator prerequisites.</span>
            </div>
            <button className="primary-action" onClick={() => approveHardware(learner.id)}>
              <LockKeyhole size={16} aria-hidden="true" />
              Approve Hardware Access
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function InstructorAnalyticsPanel({ course, overview }) {
  const gaps = overview?.cohortSkillGaps || [];
  const remediation = overview?.remediationSessions || [];
  const efficiency = overview?.learningEfficiency || {};
  const adaptivity = overview?.adaptivityQuality || {};

  return (
    <section className="panel analytics-panel" data-gsap="fade-up">
      <div className="panel-toolbar">
        <PanelTitle icon={BarChart3} title="Track 5 Analytics" />
      </div>

      <div className="analytics-grid">
        <article className="analytics-card">
          <span className="eyebrow">Learning efficiency</span>
          <strong>{efficiency.completedEvents || 0} completed events</strong>
        </article>

        <article className="analytics-card">
          <span className="eyebrow">Adaptivity quality</span>
          <strong>{percent(adaptivity.matchScore || 0)} expert overlap</strong>
        </article>
      </div>

      <div className="skill-gap-grid">
        <div>
          <h3>Cohort Skill Gaps</h3>
          {gaps.length ? (
            <div className="gap-list">
              {gaps.slice(0, 5).map((gap) => (
                <div className="gap-row" key={gap.skill}>
                  <div>
                    <strong>{gap.label}</strong>
                    <span>{gap.affectedLearners} learners need support</span>
                  </div>
                  <ScorePill score={gap.averageMastery} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No gaps yet" body="Skill gaps appear after quiz submissions." />
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="stat-card" data-gsap="scale-in">
      <Icon size={19} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

