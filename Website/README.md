# Subset Quiz Lab

Full-stack prototype for subset-based instrumentation learning.

## Run

Start the Python API:

```powershell
python backend/app.py --host 127.0.0.1 --port 8010
```

Start the React UI:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' install
& 'C:\Program Files\nodejs\npm.cmd' run dev
```

Open <http://127.0.0.1:5173>.

Backend status page: <http://127.0.0.1:8010>  
Backend API index: <http://127.0.0.1:8010/api>

Run backend smoke tests:

```powershell
python -m unittest backend.tests
```

## App Shape

- Learner side: student path setup, decision-tree routing, instrument lesson tabs, safety induction, simulator practical tasks, single-instrument exams, final integrated project exam, attempt history.
- Instructor side: learner analytics, safety and hardware approval, cohort skill gaps, remediation recommendations, practical attempt feed, quiz bank, answer-key preview.
- Backend: Python standard library HTTP API with SQLite persistence, generated course outline, instrument lessons, benchmark times, decision-tree data, safety gating, simulator-style grading, learning-time events, and capstone project data.
- Motion: GSAP-powered page, card, lesson, quiz, and console transitions.

## Track 5 Coverage

- Adaptive onboarding: decision-tree confidence check creates a focused learning path instead of showing all 63 subset quizzes.
- Learner model: quiz attempts use IRT-style theta/mastery plus instrument and sub-skill competencies.
- Practical grading: simulator tasks are graded by rules; hardware tasks stay blocked until safety induction plus instructor approval.
- Benchmarks: lessons, quizzes, practicals, safety induction, and capstone include expected completion times.
- Instructor analytics: dashboard reports cohort skill gaps, recommended remediation clinics, learning efficiency, practical attempts, safety status, and adaptivity quality versus expert cases.

## Useful API Routes

- `GET /api/course`
- `GET /api/practical-tasks`
- `GET /api/safety-induction`
- `POST /api/safety/complete`
- `POST /api/instructor/approve-hardware`
- `POST /api/practical-attempts`
- `POST /api/events/start`
- `POST /api/events/complete`
- `GET /api/instructor/overview`
