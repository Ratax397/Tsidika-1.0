# Tsidika

A simple accommodation booking app with React (Vite) front‑end and Node/Express + MongoDB back‑end. Images are stored on Cloudinary. Useful as a learning/portfolio project.

Live demo: coming soon

## Tech Stack
- Frontend: React 19, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express 5, MongoDB (Mongoose)
- Auth: Cookie‑based JWT
- Media: Cloudinary uploads (by URL and from device)
- Protection: Arcjet (basic bot detection & rate limiting)

## Working Features
- Account: register, login, logout, get current profile
- Places:
  - Create and edit your places (title, address, photos, perks, details, price)
  - Upload photos by link or from device (stored on Cloudinary)
  - Set a main photo and delete photos
  - View your places and browse all places
  - View place details
- Bookings: create a booking for a place and view your bookings

## Monorepo Layout
- api/ — Express server, models, middleware, Cloudinary & Arcjet config
- client/ — React app (Vite)

## Local Development
1) Backend (api)
- Create api/.env with at least:
  - DB_URL
  - JWT_SECRET
  - PORT (e.g. 3000)
  - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
  - ARCJET_KEY (optional but supported)
- Install deps and run:
  - npm install
  - node index.js

2) Frontend (client)
- axios baseURL is http://localhost:3000 and CORS is configured for http://localhost:5173
- Install deps and run:
  - npm install
  - npm run dev (Vite on 5173)

Open http://localhost:5173 to use the app.

## API (brief)
- POST /register, POST /login, POST /logout, GET /profile
- POST /upload-by-link, POST /upload, DELETE /delete-photo
- POST /places, PUT /placesUpdate, GET /getPlaces, GET /getPlacesById/:id, GET /listPlaces
- POST /bookings, GET /getBookings

Notes
- This is not production‑hardened. Use environment variables and secure credentials.
- Live demo link will be added when available.
