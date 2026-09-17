# 🏆 SIH 2026 - 1-Click Judge Demo Mode Specification & Pitch Script
**Problem Statement ID:** 26097  
**Project:** GramSaksham (ग्राम सक्षम) - AI-Driven Multilingual Voice Assistant for Livelihood & NSQF Skilling  
**Target Ministries:** Ministry of Skill Development and Entrepreneurship (MSDE) & Ministry of Rural Development (MoRD)  

---

## 🎯 Purpose of "Judge Demo Mode"
During the SIH Grand Finale presentation, teams usually have only **3 to 5 minutes** to pitch. Typing inputs manually or relying on live rural microphone acoustics in noisy hackathon halls risks delays or recognition errors.

**"Judge Demo Mode"** provides a 1-click end-to-end automated simulation that demonstrates all key aspects of the portal in **under 90 seconds**.

---

## 🎭 Two High-Impact Personas

### Persona A: "Kisan Drone Didi - Barwani, MP"
* **Beneficiary Profile:**
  * **Name:** Sunita Bai (22 yrs, 10th Pass)
  * **Current Informal Work:** Unskilled farm labor (Rs 5,000/month)
  * **Location:** Barwani District (Aspirational District, MP)
  * **Aspiration:** Wants to operate agricultural drones for nano-fertilizer spraying
* **Simulated 1-Click Flow:**
  1. **Voice Input Simulation:** "Main Barwani se hoon, 10th pass, mujhe drone chalana seekhna hai aur apna kaam shuru karna hai."
  2. **AI Voice Assistant (Saksham Sathi):** Responds in rural Hindi audio explaining DGCA certified Kisan Drone Operator course (NSQF Level 5).
  3. **Skill Gap Diagnostics:** Maps 10th pass qualification -> 6-week DGCA training at local KVK Barwani -> Rs 250/day DBT stipend.
  4. **Income Leap:** Rs 5,000/mo -> Rs 32,000/mo (540% leap).
  5. **Credit & Scheme Linkage:** PM MUDRA Kishor Loan (Rs 3.5 Lakh) + Lakhpati Didi SHG subsidy.
  6. **Official Pass:** Generates Barwani KVK learner pass with QR code.

---

### Persona B: "Surya Mitra Solar Pump Specialist - Sehore, MP"
* **Beneficiary Profile:**
  * **Name:** Rajesh Malviya (25 yrs, 8th Pass)
  * **Current Informal Work:** Basic village electrician helper (Rs 7,500/month)
  * **Location:** Sehore District, MP
  * **Aspiration:** Rooftop solar and solar agricultural pump maintenance
* **Simulated 1-Click Flow:**
  1. **Voice Input Simulation:** "Gaon mein solar water pump repairing aur installation ka sarkari kaam karna chahta hoon."
  2. **AI Voice Assistant:** Recommends Surya Mitra under PM-KUSUM (NSQF Level 4).
  3. **Skill Gap Diagnostics:** Highlights diagnostic gap (high voltage DC safety & inverter wiring) -> 8 weeks hands-on training.
  4. **Income Leap:** Rs 7,500/mo -> Rs 28,000/mo.
  5. **Govt Linkage:** PM Surya Ghar Muft Bijli Yojana vendor empanelment.

---

## 🛠️ Proposed Implementation Blueprint (For Next Phase)

### 1. UI Entry Point
* Add a shiny **"1-Click Judge Demo (SIH Quick Walkthrough)"** button in:
  * Top bar / Navbar (`GovtNavbar.jsx`)
  * Hero Section banner (`HeroBanner.jsx`)

### 2. Interactive Auto-Runner Component (`JudgeDemoModal.jsx`)
* A modal with 4 sequential stages (each takes 15-20s or user can click 'Next Step'):
  * **Stage 1 (0:00 - 0:20):** Auto-plays simulated beneficiary voice inquiry in Hindi with visual waveform.
  * **Stage 2 (0:20 - 0:45):** Live typing & Gemini AI response streaming showcasing ultra-fast `<1.2s` latency.
  * **Stage 3 (0:45 - 1:10):** Automatically switches to Hyperlocal Map, auto-focuses Barwani KVK center, showing 12 km radius.
  * **Stage 4 (1:10 - 1:30):** Displays the generated 4-Phase AI Roadmap & Pops up the official Government Learner Pass ready for print.

### 3. Judge Pitch Script (Spoken by Team Lead during demo):
> *"Honorable Judges, 65% of rural youth lack access to formal skill counseling. GramSaksham bridges this gap with zero-form voice AI. In just 90 seconds, you witnessed how an illiterate or semi-literate farmer from an aspirational district like Barwani converts a simple voice query into a certified NSQF Level 5 career roadmap, complete with KVK center mapping, MUDRA loan linkage, and a verified QR Learner Pass."*

---
*Saved for later implementation | SIH 2026 Presentation Blueprint*
