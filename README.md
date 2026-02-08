# 🏨 Smart Hostel Management System

<div align="center">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="70" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="70" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" width="70" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="70" />

<br />

**A full‑stack hostel management web application built to handle real‑world campus operations efficiently.**

[🌐 Live Website](https://smart-hostel-6q9b.onrender.com)
  •  
[⚙️ Backend Health](https://smart-hostel-backend-rxm4.onrender.com/api/health)

</div>

---

## ✨ Overview

Smart Hostel Management System is a **production‑ready full‑stack application** designed to manage hostel‑level operations such as issue reporting, announcements, lost & found tracking, and analytics.

The project focuses on:

* Clean architecture
* Secure authentication
* Scalable backend APIs
* Modern, responsive UI

This is a **personal project** built to demonstrate strong full‑stack engineering practices.

---

## 🚀 Key Features

### 👤 Authentication & Authorization

* JWT‑based authentication
* Role‑based access (Student / Management)
* Secure protected routes

### 🛠 Issue Tracking

* Report hostel issues (plumbing, cleanliness, electrical, etc.)
* Priority levels (low → emergency)
* Status tracking (reported → in progress → resolved)

### 📢 Announcements

* Create & manage announcements
* Target specific user roles
* Reaction & comment support (extendable)

### 📦 Lost & Found

* Post lost or found items
* Claim workflow with timestamps
* Ownership tracking

### 📊 Analytics Dashboard

* Issue trends & category breakdowns
* Role‑based data visibility

---

## 🧩 Tech Stack

### Frontend

* **React + TypeScript**
* **Vite** (fast builds)
* **Tailwind CSS** (responsive UI)
* Axios for API communication

### Backend

* **Node.js + Express**
* **MongoDB Atlas**
* **JWT Authentication**
* Rate limiting, Helmet, CORS security

### Deployment

* **Render** (Frontend + Backend)
* Environment‑based configuration

---

## 📁 Project Structure

```bash
frontend/
 ├─ src/
 │  ├─ pages/
 │  ├─ components/
 │  ├─ contexts/
 │  ├─ types/
 │  └─ utils/

backend/
 ├─ routes/
 ├─ models/
 ├─ middleware/
 ├─ config/
 └─ server.js
```

---

## 🔐 Environment Variables

### Backend

```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_secret
FRONTEND_URL=https://smart-hostel-6q9b.onrender.com
```

### Frontend

```env
VITE_API_URL=https://smart-hostel-backend-rxm4.onrender.com/api
```

---

## 🎨 UI & UX

* Clean, modern interface
* Mobile‑responsive layouts
* Role‑aware navigation
* Smooth state updates

> UI responsiveness improvements are actively ongoing.

---

## 🔗 Connect With Me

<div align="center">

<a href="https://github.com/your-github-username">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" width="40" />
</a>
&nbsp;&nbsp;
<a href="https://linkedin.com/in/your-linkedin-username">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg" width="40" />
</a>

</div>

---

## 📌 Notes

* Built with scalability and security in mind
* Uses real production deployment practices
* Designed as a long‑term extendable system

---

⭐ If you find this project interesting, feel free to star the repository!
