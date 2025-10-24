# 🏥 LifeBoon Frontend

**LifeBoon** is a smart emergency response web app that helps users quickly locate nearby hospitals, view key details (like beds available and contact info), and take immediate action — such as booking appointments or getting directions.
This frontend is built using **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **React Leaflet** for real-time interactive maps.

---

## ⚡ Features

* 🗺️ Interactive map centered on the user's current location
* 🏥 Nearby hospitals displayed with detailed info popups
* 📍 Live geolocation updates
* 💬 Quick action buttons ("Get Directions", "Book Appointment")
* 🎨 Modern responsive UI with Tailwind CSS
* 🔥 Optimized SSR setup using Next.js dynamic imports

---

## 🧰 Tech Stack

| Category            | Tools Used                    |
| ------------------- | ----------------------------- |
| **Framework**       | Next.js 15 (App Router)       |
| **Language**        | TypeScript                    |
| **Styling**         | Tailwind CSS + PostCSS        |
| **Map Rendering**   | React Leaflet + OpenStreetMap |
| **Icons / Assets**  | Leaflet default markers       |
| **Package Manager** | npm                           |

---

## 🧑‍💻 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page rendering the map
│   │   └── globals.css       # Global Tailwind styles
│   └── components/
│       └── Map.tsx           # Map component with hospital markers
├── public/
│   └── next.svg, vercel.svg  # Static assets
├── package.json
└── tailwind.config.js
```

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
cd frontend
npm install
```

If you face peer dependency errors (e.g., with `react-leaflet`), run:

```bash
npm install --legacy-peer-deps
```

---

### 2️⃣ Run the development server

```bash
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### 3️⃣ Edit and see live changes

You can start modifying the app in `src/app/page.tsx` or customize the `Map` component in `src/components/Map.tsx`.
The app will auto-update as you save your files.

---

## 🧭 Environment Notes

If your map doesn’t load correctly:

* Ensure location access is allowed in your browser.
* Check console logs for `Leaflet` or geolocation errors.
* Restart the dev server after installing new packages.

---

## 🌍 Future Enhancements

* 🩺 Integrate backend APIs to fetch real hospital data
* 🕓 Show real-time hospital capacity & wait times
* 🧠 Add AI triage assistant to recommend nearest best-fit hospital
* 📱 Build a mobile-responsive PWA version
* 🧩 Add authentication for hospital staff dashboards

---

## 📜 License

This project is licensed under the **MIT License**.
You’re free to use and modify it with attribution.

---
