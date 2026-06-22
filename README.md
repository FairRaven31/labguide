# LabGuide Interactive Learning Suite

Welcome to the LabGuide Interactive Learning Suite repository! This project combines an Augmented Reality (AR) application and a comprehensive web-based Learning Management System (LMS) designed for subset-based instrumentation learning and laboratory safety.

## 1. Project Overview

### The AR Application (`AR App`)
The AR component is a Unity-based Augmented Reality application (project name: `artest3`). It is designed to provide immersive, interactive simulations of laboratory hardware and instruments. By using AR, learners can visualize, interact with, and practice on virtual counterparts of physical lab equipment before handling real-world hardware. This ensures safety and builds practical competency.

### The LabGuide Website (`Website`)
The LabGuide Website is a full-stack educational portal that serves two main audiences:
* **Learners:** Features a subset-based quiz system, decision-tree routing for adaptive learning paths, safety inductions, and instrument lesson tabs. It manages their progression from theory to virtual simulation, and finally to physical hardware tasks.
* **Instructors:** Provides a dashboard for learner analytics, cohort skill gap tracking, hardware approval gating, and remediation recommendations.

The website is built using **React** (with Vite) and uses a **Python** backend API with an SQLite database (`university_lab.db`) to persist course outlines, completion benchmarks, and learner attempts.

---

## 2. How to Run the Applications

### Running the AR App
The AR application is built with Unity. To run or modify it:

1. **Install Unity:** Ensure you have Unity installed (version `6000.4.8f1` is recommended based on the project settings). You can install this via Unity Hub.
2. **Open the Project:** 
   - Open Unity Hub.
   - Click **Add** -> **Add project from disk**.
   - Navigate to the `AR App/artest3` folder within this repository and select it.
3. **Run in Editor:** Open the project. You can press the **Play** button at the top of the Unity Editor to test the AR functionalities via simulator or a connected device.
4. **Build to Device:** To deploy the app to an AR-capable device (like an Android/iOS smartphone or a VR/AR headset):
   - Go to **File** -> **Build Settings**.
   - Select your target platform (e.g., Android, iOS).
   - Click **Build and Run** with your device connected via USB.

### Running the LabGuide Website
The web application requires Node.js and Python.

1. **Prerequisites:** 
   - Install [Node.js](https://nodejs.org/).
   - Install [Python 3.x](https://www.python.org/).
   
2. **Start the Backend API:**
   Open a terminal, navigate to the `Website` directory, and run the Python backend:
   ```powershell
   python backend/app.py --host 127.0.0.1 --port 8010
   ```
   *(Note: Ensure you are in the correct directory where `app.py` is located. The API will run on http://127.0.0.1:8010).*

3. **Start the React Frontend:**
   Open a separate terminal, navigate to the `Website` directory, and run:
   ```powershell
   npm install
   npm run dev
   ```
   
4. **Access the Application:**
   Once both servers are running, open your web browser and navigate to:
   - **Frontend UI:** [http://127.0.0.1:5173](http://127.0.0.1:5173)
   - **Backend API Status:** [http://127.0.0.1:8010](http://127.0.0.1:8010)
