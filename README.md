# 卐 PROVIDENCE — Vedic Destiny & Panchangam
### వేద జ్యోతిష్యం, కుండలి చక్రం & నిత్య పంచాంగం

> **"The stars map cosmic rhythms; conscious effort (పురుషార్థం) and wisdom shape your destiny."**

[![Powered By](https://img.shields.io/badge/POWERED%20BY-Asish%20Pathikayala-B71C1C?style=for-the-badge&logo=astronomy&logoColor=white)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-15803D?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Node.js%20%7C%20Local--First-D97706?style=for-the-badge)](#)
[![Calculations](https://img.shields.io/badge/Ayanamsha-Lahiri%20Chitra%20Paksha-475569?style=for-the-badge)](#)

---

## 🌟 Overview

**Providence** is a comprehensive, authentic, sidereal **Vedic Astrology & Panchangam** web platform engineered with a **100% Dynamic Predictive Engine**. Unlike generic horoscope tools that repeat identical templates with only names swapped, Providence synthesizes every single reading uniquely from the native's exact Date of Birth, Birth Time, Moon Sign (రాశి), Birth Star (నక్షత్రం), Ascendant (లగ్నం), and Numerology Life Path.

The interface combines an English control system with rich, classical Telugu for all astrological predictions, remedies, stotras, and panchangam data.

---

## ✨ Key Features

### 1. 🔮 100% Dynamic Multi-Dimensional Predictive Matrix
- **12 Rasi Profiles (`RASI_PROFILES`)**: Unique *Swabhavam* (core nature), *Mindset* (thinking style), *Weaknesses* (areas for improvement), *Auspicious Careers* (tailored professions), *Vastu Directions*, *Gemstone Prescriptions*, and *Lucky Numbers*.
- **27 Nakshatras & 9 Planetary Lords (`NAKSHATRA_REMEDIES`)**: Tailored remedies across Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, and Mercury with dedicated Deities, Stotras, sacred Mantras, and charity acts.
- **Dynamic Age Milestones**: Calculates life and career milestones dynamically derived from the native's actual birth year (e.g., ages 22–25, 28–32, 36–40, etc.).
- **Vimshottari 120-Year Dasha Timeline**: Real-time identification of the currently active Mahadasha with specific planetary climate interpretations.

### 2. 🕊️ Dual-Mode Engine: Living Native vs. Memorial Study
- **🟢 Living Native Mode (ప్రస్తుత జీవన జాతకం)**:
  - Full character breakdown, career trajectory, auspicious gemstone, and progressive life milestones.
- **🕊️ Memorial / Historical Mode (గతించిన వారి చారిత్రక & ఆత్మకారక విశ్లేషణ)**:
  - Specifically designed for departed souls or historical figures (with **auto-detection for birth years > 100 years ago**).
  - Eliminates irrelevant future predictions.
  - Generates a **Soul Blueprint & Life Review**, classical **Ayurdaya (Longevity & Maraka house analysis)**, and sacred memorial remedies (Pithru Tarpanam, Gayathri/Mrityunjaya Japa, Annadanam, and Gosamrakshana).

### 3. 📐 Classical Kundali Chakra & Dasha Table
- Dynamic SVG rendering of the Vedic Kundali chart showing planet placements across all 12 Bhavas.
- Chronological Vimshottari Mahadasha balance table spanning birth to 120 years.

### 4. 📅 Interactive Telugu Calendar & Panchangam
- Interactive date selector showing:
  - **తిథి (Tithi)** & పక్షం (Shukla / Krishna)
  - **నక్షత్రం (Nakshatra)** & యోగం / కరణం
  - **అమృత గడియలు (Amrutha Gadiyalu)**
  - **రాహు కాలం (Rahu Kalam)** & **దుర్ముహూర్తం (Dhurmuhurtham)**
  - **సూర్యోదయం & సూర్యాస్తమయం (Sunrise / Sunset)**
  - **పండుగల విశేషాలు (Hindu Festivals)**

### 5. 🎨 Daily Planetary Cloth Colors (వారాల రంగులు)
- Curated color recommendations for each day of the week aligned with planetary deities (Sun to Saturn) to enhance harmony, focus, and positive energy.

### 6. 🔒 Local-First & Zero-Tracking Privacy Guarantee
- **100% Private**: Runs completely inside the client browser and local system.
- **Persistence**: Automatically remembers profiles via browser `localStorage` and writes backups to `data/user_profiles.json` through the local Node server.

---

## 📁 Repository Structure

```
Proevidence/
├── index.html                 # Complete Single-Page Application (UI + Engine)
├── server.js                  # Zero-dependency Node.js HTTP server + Local DB API
├── Start_Providence.bat       # 1-Click Windows Launcher (Starts server & opens app)
├── providence_simulator.html  # Verification & testing simulator
├── data/
│   └── user_profiles.json     # Local JSON database for saved profiles
├── .gitignore                 # Standard clean Git ignore
└── README.md                  # Comprehensive Documentation & Deployment Guide
```

---

## 🚀 Running Locally (Windows / Mac / Linux)

### Method 1: Instant 1-Click Launch (Windows)
Double-click `Start_Providence.bat` in the project folder. It will:
1. Start the local server on `http://localhost:3000`.
2. Automatically launch your default web browser to the app.

### Method 2: Node.js Command Line
```bash
# Navigate to the project directory
cd D:\Proevidence

# Start the zero-dependency server
node server.js
```
Open your browser at: **`http://localhost:3000`**

### Method 3: Direct File Open
Because `index.html` is built with pure web technologies and zero external build steps, you can directly double-click `index.html` to run the full application offline in any modern browser!

---

## 📤 Step-by-Step GitHub Setup Guide

Follow these steps to upload Providence to your GitHub account:

### Step 1: Open Terminal in Project Directory
Open **PowerShell** or **Command Prompt** and navigate to the project directory:
```bash
cd D:\Proevidence
```

### Step 2: Initialize Git & Stage Files
```bash
# 1. Initialize local Git repository
git init

# 2. Add all files to staging
git add .

# 3. Create initial commit
git commit -m "feat: Initial release of Providence Vedic Destiny platform"
```

### Step 3: Create a Repository on GitHub
1. Log in to [GitHub](https://github.com).
2. Click the **`+`** icon in the top right corner and select **New repository**.
3. Name your repository: `providence` or `vedic-destiny`.
4. Choose **Public** or **Private**.
5. **Do NOT** initialize with a README, .gitignore, or license (we already have them created).
6. Click **Create repository**.

### Step 4: Link Remote & Push
Copy the repository URL shown on GitHub and run:
```bash
# Rename branch to main
git branch -M main

# Link to your remote GitHub repo (replace with your actual GitHub username)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/providence.git

# Push code to GitHub
git push -u origin main
```

---

## 🌐 Free Web Deployment Options

### Option A: GitHub Pages (Instant Free Web Hosting — Recommended)
Since Providence is fully self-contained in `index.html`, you can host it live on the web for free using GitHub Pages:

1. Open your repository on GitHub.
2. Go to **Settings** → **Pages** (in the left sidebar).
3. Under **Branch**, select `main` and folder `/ (root)`.
4. Click **Save**.
5. Within 1–2 minutes, GitHub will provide a live public URL:
   ```
   https://<YOUR_GITHUB_USERNAME>.github.io/providence/
   ```

---

### Option B: Vercel (Fast Global CDN Hosting)
1. Sign up / Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New...** → **Project**.
3. Import your `providence` GitHub repository.
4. Keep all build settings default (Framework: *Other*).
5. Click **Deploy**.
6. Your app is now live with an instant SSL certificate (`https://providence-xxx.vercel.app`).

---

### Option C: Netlify
1. Log in to [Netlify](https://netlify.com).
2. Drag and drop your project folder or connect your GitHub repository.
3. Publish directory: `.` (root).
4. Click **Deploy Site**.

---

### Option D: Full-Stack Deployment with Node.js Server (Render / Railway)
If you want to host the `server.js` backend with `POST /api/save-record` to persist profiles to a server filesystem:

#### On Render.com:
1. Create a free account on [Render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Environment**: `Node`
   - **Build Command**: *(leave blank)*
   - **Start Command**: `node server.js`
5. Click **Create Web Service**.

---

## 🎨 Design Philosophy & Color Palette

The user interface follows a clean, ceremonial Vedic aesthetic:
- **Canvas Background**: Pure Pristine White (`#FFFFFF`)
- **Sacred Accent**: Sacred Kunkuma Red (`#B71C1C`)
- **Auspicious Accent**: Haritha Green (`#15803D`)
- **Celestial Gold**: Suvarna Gold (`#D97706`)
- **Typography**: Clean modern sans-serif for navigation & inputs; classical *Noto Sans Telugu* for deep astrological readings.

---

## ⚖️ Spiritual Disclaimer

*Vedic Astrology is an ancient sidereal science of energetic timing and cosmological tendencies. Planetary configurations indicate tendencies and cosmic climates; individual conscious effort (**పురుషార్థం - Purushartha**), righteousness (**ధర్మం - Dharma**), and free will shape life's ultimate destination. Providence provides insights for mindful self-reflection and auspicious planning.*

---

## 👤 Author & Branding

**POWERED BY Asish Pathikayala**  
*Monogram Logo:* **AP**  
*Copyright © 2026 Asish Pathikayala. All Rights Reserved.*
