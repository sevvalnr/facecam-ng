
# 🎥 FaceCam NG – Real-Time Facial & Emotion Recognition (Angular + TypeScript)

A modern **Angular + TypeScript + Bootstrap** web application that uses **face-api.js** for real-time **facial detection, emotion, age, and gender recognition** directly from the user's webcam.  
All inference runs entirely in the browser — **no image data leaves the device**.

Built with a **Redux-style NgRx state management** architecture and deployed via **Vercel**.

---

##  Live Demo

 [https://facecam-ng.vercel.app](https://facecam-ng.vercel.app)  
> Requires HTTPS & webcam permission.


##  Features

 Start / Stop webcam feed  
 Detect multiple faces simultaneously  
 Recognize facial expressions (happy, sad, angry, surprised, neutral, etc.)  
 Estimate age and gender using pre-trained models  
 Overlay bounding boxes & emotion labels in real-time  
 Upload static images for detection (bonus feature)  
 Built with NgRx pattern for state management  
 Mobile-friendly, responsive UI via Bootstrap  

---

## Tech Stack

| Layer | Technologies |
|-------|---------------|
| Framework | Angular 17+, TypeScript |
| State Management | NgRx (Actions, Reducers, Effects, Selectors) |
| ML Library | face-api.js (TensorFlow.js wrapper) |
| Styling | SCSS + Bootstrap |
| Deployment | Vercel |
| Build Tools | Angular CLI, Webpack |

