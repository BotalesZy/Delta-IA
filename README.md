# Δ Delta AI — Emotional & Situational Interactive Artificial Intelligence

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Gemini_Pro-8E75FF?style=flat&logo=googlegemini&logoColor=white)](https://deepmind.google/technologies/gemini/)

**Delta AI** is not just another generic chat interface. It is an advanced AI assistant equipped with **situational awareness, shifting emotional states, and real-time environment reactivity**. Delta's visual core—an interactive, living cube—responds dynamically not only to your prompts but also to your physical actions on the webpage, judging you, nodding off, or guarding its privacy if you try to peek under the hood.

🚀 **Live Demo:** [Deployed on GitHub Pages](https://your-username.github.io/your-repository/) *(Replace with your actual link)*

---

## 🧠 Core Features & Delta's "Consciousness"

Delta has a highly expressive personality that adapts seamlessly between its two main layouts (**Simple Mode** and **Interactive Mode**):

* 🎭 **Dynamic Emotion System:** Delta actively reads between the lines. If you share something heartbreaking, its interface will shift to a melancholic state; it will instantly adapt its demeanor if you are hostile, analytical, or friendly.
* 👁️ **Environment Awareness (Sidebar Tracking):** Delta knows exactly what you are doing on your screen. If you expand the Sidebar, it will notice and judge you with its gaze; collapse it, and it will shift its attention back to the center, glancing curiously from side to side.
* 💤 **Automated Sleep Cycle:** If left idle for a while, Delta will fall into a deep slumber (complete with custom sleep animations). While sleeping, it completely ignores layout adjustments or sidebar toggles... until you type a message to wake it up instantly!
* 🚫 **Privacy Guard (DevTools Detector):** Delta fiercely protects its personal space. Attempting to open the browser console (F12 / Inspect Element) triggers an immediate defensive reaction, causing Delta to call you out on the spot for invading its privacy.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** Modular, reactive, and highly optimized architecture powered by **React.js**.
* **Styling & Motion:** Raw CSS3 coupled with a robust responsive ecosystem (`mobile/`) and smooth animation transitions (leveraging `Animate.css` styling patterns for seamless *fade-ins* and sleep states).
* **Cognitive Core:** Seamlessly connected to **Google Gemini** models to ensure quick-witted, human-like, and contextual responses.
* **Backend & Security (Firebase):**
    * **Firebase Auth:** Professional hybrid authentication. It supports traditional email registration (featuring active link verification and Gravatar fallback integration) alongside lightning-fast Social Logins through **Google** and **GitHub** (automatically extracting profile pictures).
    * **Cloud Firestore:** Real-time persistence and cloud synchronization for chat history and user-renamed chat titles.

---

## 📂 Project Structure

The project follows a strict separation of concerns, keeping authentication UI, dashboard modules, and emotional rendering engines decoupled:

```text
Parent-Folder/
├── public/
│   ├── svg/                    # UI icons and custom vector assets
│   │   ├── bin.svg, delta.svg, eyeClosed.svg, userD.svg, googleIco.png, etc.
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth-Components/    # Reusable login blocks (Button, Inputs, SEO manager)
│   │   ├── Delta-Components/   # Chat dialog and bubble interfaces
│   │   ├── Delta-Dashboard/    # Main app modules (Sidebar, ChatForm, DevTools Detector)
│   │   ├── Emotions/           # Specialized animation styles (Sad.css, Sleepy.css, Wakeup.css)
│   │   └── orientationBlock.jsx
│   ├── pages/
│   │   ├── AuthPage.jsx        # Smart desktop & mobile login portal
│   │   ├── Dashboard.jsx       # Interactive control panel for chatting with Delta
│   │   └── css/                # Segmented desktop stylesheets and specific mobile layouts
│   ├── App.jsx                 # Master router and global auth state controller
│   ├── firebase.js             # Initialized Firebase SDK credentials
│   └── index.js
├── package.json
└── README.md
```

---

## 💻 Local Setup & Installation

To clone Delta's laboratory and run the engine locally, execute the following steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. **Install project dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables (`.env`):** Create a `.env` file in the root directory and map out your Firebase keys and Gemini token:

   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Boot up the local development server:**

   ```bash
   npm start
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to begin testing Delta's awareness.

---

## 📄 License

This project is licensed under the terms of the MIT License. You are completely free to use, tweak, and distribute this software for personal, academic, or commercial research. Check the license file for full details.

---

*Engineered with 10,000% effort and a deep passion for interactive web design.* 🚀🔬
