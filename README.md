# 📊 Real Estate Sales KPI & OJT Evaluation System

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Google Sheets API](https://img.shields.io/badge/Google%20Sheets%20API-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)

An internal enterprise web application designed for **Praja Sakti Group (GDC & NGT Divisions)** to digitize, standardize, and automate the On-the-Job Training (OJT) and periodic performance evaluations of real estate sales personnel.

🔗 **[Live Demo](https://sales-gdc-eval-app.vercel.app/)**

---

## 🎯 Business Problem & Objective

Previously, evaluating sales personnel across weekly OJT milestones required manual spreadsheet calculations, leading to inconsistent grading criteria and delayed reporting between branch managers and HR/Operations.

**This system solves that by:**
1. **Standardizing KPIs:** Implementing a structured 5-pillar, 18-point behavioral and CRM-driven assessment matrix.
2. **Automating Weighted Math:** Dynamically calculating real-time cumulative scores across weighted operational pillars (100% total weight) as managers input ratings.
3. **Zero-Cost Cloud Persistence:** Piping evaluation submissions directly into centralized Google Sheets databases with an integrated `/rekap` dashboard for instant managerial review.

---

## ⚙️ Core Features & Scoring Architecture

### 1. Multi-Pillar Weighted Scoring Engine
The application evaluates sales representatives on a 1–5 Likert scale across 5 domain-specific KPI categories:
* **Daily Leads Discipline (40% Weight):** Target achievement, daily consistency, lead qualification quality, and reporting punctuality.
* **Technical Sales Execution (20% Weight):** Online/offline pitching, follow-up persistence, and closing conversion techniques.
* **SOP & CRM Mastery (15% Weight):** CRM data hygiene (leads, visits, booking status), SOP adoption speed, and internal tool proficiency.
* **Work Attitude & Communication (15% Weight):** Persuasive communication, data integrity, proactive lead hunting, accountability, and team collaboration.
* **Attendance & Shift Discipline (10% Weight):** Shift schedule adherence and punctuality.

### 2. Automated Decision Support
* **Live Progress & Score Estimation:** Tracks completion (`0 of 18 metrics scored`) and computes cumulative weighted scores on the fly.
* **Auto-Generated Recommendations:** Automatically suggests pass/revision/coaching statuses based on final score thresholds, with support for manual manager overrides and qualitative feedback notes.
* **Centralized Recapitulation (`/rekap`):** Synchronizes with Google Sheets in real time so leadership can filter evaluations by division (`Sales GDC`, `Sales NGT`) and evaluation period (`OJT Weeks 1–4`, `Final Evaluation`).

---

## 🛠️ Tech Stack & System Architecture

* **Frontend:** Next.js / React, responsive custom UI tailored for desktop and tablet managerial workflows.
* **Backend / Data Layer:** Google Sheets API / Google Apps Script webhook integration acting as a lightweight relational datastore.
* **Deployment:** Vercel CI/CD pipeline.

---

## 🚀 Local Development Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/sales-kpi-evaluation-system.git](https://github.com/yourusername/sales-kpi-evaluation-system.git)
   cd sales-kpi-evaluation-system
