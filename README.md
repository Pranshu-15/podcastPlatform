<div align="center">
  
# 🎙️ Podcast Platform
**A modern, full-stack web application for creators to host, manage, and share their audio content.**

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB.svg)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Backend-Node.js-339933.svg)](https://nodejs.org/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5.svg)](https://cloudinary.com/)

</div>

---

## 🌟 Overview
The **Podcast Platform** is a premium MERN stack application designed to give audio creators a seamless experience. Built from the ground up with a stunning, high-performance **Glassmorphism UI**, the platform allows users to create accounts, upload podcasts, publish audio episodes, and listen seamlessly via a persistent, globally-synchronized custom audio player.

## ✨ Key Features

### 🎧 For Listeners
- **Persistent Global Audio Player:** A custom-built, fixed audio player that stays with you as you navigate between pages. Features custom seek bars, volume controls, spinning artwork, and synchronized play/pause states.
- **Dynamic Browsing:** Browse a catalog of community-created podcasts sorted by genre.
- **Smooth Animations:** Powered by **GSAP**, lists and pages load with elegant stagger and fade-in animations.
- **Responsive Design:** A fully mobile-optimized experience with responsive hamburger navigation and smart layouts that adapt to your screen size.

### 🎙️ For Creators
- **Secure Authentication:** JWT-based authentication system with encrypted passwords via bcrypt.
- **Podcast Management:** Create new podcast series with dedicated Display Images and ultra-wide Banner Images.
- **Episode Publishing:** Upload `.mp3` audio files directly to your podcast.
- **Media Hosting:** Fully integrated with **Cloudinary** for lightning-fast, highly-optimized image and audio streaming.
- **Creator Dashboard:** A personalized profile page tracking your total podcasts, episodes, and platform tenure.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **React.js 18** - UI Library
- **Redux Toolkit** - Global State Management (User Authentication & Podcast Caching)
- **React Router Dom v6** - Dynamic Client-Side Routing
- **GSAP (GreenSock)** - High-performance UI Animations
- **Axios** - Promise-based HTTP client with Axios Interceptors for JWT attachment
- **Pure Vanilla CSS** - Custom design system implementing a dark-theme glassmorphism aesthetic (no UI libraries).

### Backend (Server)
- **Node.js & Express.js** - RESTful API Architecture
- **MongoDB & Mongoose** - NoSQL Database and Object Data Modeling
- **JSON Web Tokens (JWT)** - Secure route protection and authorization
- **Bcrypt.js** - Secure password hashing
- **Multer & Stream.PassThrough** - Memory-storage file handling for direct-to-cloud streams
- **Cloudinary SDK** - Cloud storage provider for Images and Audio Files

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with a MongoDB database (e.g., MongoDB Atlas) and a Cloudinary account.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/podcast-platform.git
cd podcast-platform
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment variables.
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the app.
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend/` directory (Optional, for deployment):
```env
REACT_APP_API_URL=http://localhost:5000/api
```
Start the React application:
```bash
npm start
```

---

## 📐 Architecture Highlights
- **Auth-Aware Navigation:** The header dynamically updates to hide/show authentication options based on the user's active session state in Redux.
- **Lifted State Synchronization:** The audio playback state (`isPlaying`) is lifted to the parent components to ensure that clicking "Play" on a specific episode card instantly reflects the correct playing/paused icon inside the global fixed bottom player.
- **CSS Variables & Tokens:** The entire application's aesthetic is controlled via a centralized CSS variable system in `index.css`, making themes easily modifiable.

---

<div align="center">
  <p>Built with ❤️ using the MERN Stack</p>
</div>
