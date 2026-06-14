# ⚡ Xeno CRM — AI-Native Mini CRM

> Built for Xeno's FDE Internship Assignment 2026

A marketing CRM that helps brands reach their shoppers intelligently — powered by AI.

🌐 **Live Demo:** https://xeno-crm-topaz.vercel.app  
📦 **Backend:** https://xeno-crm-backend-juzy.onrender.com  
🔀 **Channel Service:** https://xeno-crm-channel-avou.onrender.com

---

## What I Built

An AI-native Mini CRM where a marketer can:
- Describe a campaign goal in plain English
- AI automatically segments the audience and writes the message
- Campaign gets sent across WhatsApp/SMS/Email (stubbed)
- Real-time delivery tracking via async callback loop

---

## Features

| Feature | Description |
|---|---|
| 🤖 AI Campaign Assistant | Describe goal → AI segments + writes message |
| 👥 Customer Management | 50 customers with VIP/At Risk/New badges |
| 📢 Campaign Management | Create, send, track campaigns |
| 📊 Analytics Dashboard | Real-time delivered/opened/clicked/failed stats |
| 🔀 Channel Stub Service | Simulates WhatsApp/SMS/Email async delivery |

---

## Architecture
[xeno_crm_architecture.pdf](https://github.com/user-attachments/files/28924253/xeno_crm_architecture.pdf)

---
## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, Vercel
- **Backend:** Node.js, Express, Render
- **Database:** Supabase (PostgreSQL)
- **AI:** Groq API (LLaMA 3.1)
- **Channel Stub:** Node.js microservice on Render

---

## Local Setup

```bash
# Clone
git clone https://github.com/harina-30/xeno-crm.git
cd xeno-crm

# Backend
cd backend
npm install
# Create .env with SUPABASE_URL, SUPABASE_KEY, GROQ_API_KEY, PORT=5000, CHANNEL_SERVICE_URL
node index.js

# Channel Service
cd ../channel-service
npm install
node index.js

# Frontend
cd ../frontend
npm install
npm run dev
```

---

## AI-Native Workflow

AI is woven into the product itself:
- Marketer types a goal in natural language
- Groq LLaMA 3.1 segments the audience and generates a personalized message
- One click launches the campaign to all 50 customers

Built using Claude as my development AI assistant throughout.

---

*Submission for Xeno FDE Internship Drive 2026*
