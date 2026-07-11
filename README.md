# 🎬 Sylex

A modern entertainment discovery platform that helps users explore movies, books, games, music, recipes, drinks, activities, and curated collections through a clean and immersive interface.

---

## ✨ Features

* 🎥 Discover trending, popular and top-rated movies
* 🎮 Browse games using the RAWG API
* 📚 Search books with Google Books
* 🍳 Explore recipes from TheMealDB
* 🎵 Mood-based music playlists
* 🍹 Drinks & cocktail explorer
* 🌍 Indoor and outdoor activity suggestions
* ⭐ Favorites dashboard
* 🔐 Secure user authentication
* 📧 Welcome email on signup
* 🎨 Responsive UI with smooth animations

---

## 🛠️ Tech Stack

### Frontend

* React 18
* Vite
* Tailwind CSS
* React Router v6
* Framer Motion
* Lucide React

### Backend

* FastAPI
* JWT Authentication
* Bcrypt
* MongoDB Atlas
* Resend Email API

### External APIs

* TMDB
* RAWG
* Google Books
* TheMealDB

---
cd
## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/saraswathyysridhar/sylex.git
cd sylex
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Runs on:

```
https://sylex.onrender.com
```

---

## 🔑 Environment Variables

### frontend/.env

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_RAWG_API_KEY=your_rawg_api_key
VITE_GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

### backend/.env

```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key
# optional alias for SECRET_KEY
JWT_SECRET_KEY=your_secret_key
BREVO_API_KEY=your_brevo_api_key
# optional alias for BREVO_API_KEY
RESEND_API_KEY=your_brevo_api_key
FROM_EMAIL=your_verified_email
APP_URL=https://your-app-url
```

---

## 📂 Project Structure

```
sylex/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── app.py
│   ├── email_service.py
│   └── requirements.txt
│
└── README.md
```

---

## 🌐 Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📄 License

This project was built for learning and portfolio purposes.