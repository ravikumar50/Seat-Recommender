# 🛫 Scenic Seat Recommender

A Next.js and Express.js application that helps travelers choose the best airplane window seat for scenic views like sunrises and sunsets.

## 🌟 Features

- **Smart Seat Recommendations**: Get left/right side recommendations based on flight path and sun position
- **Real-time Flight Paths**: Great-circle route calculations using Turf.js
- **Sun Position Tracking**: Accurate astronomical calculations with SunCalc
- **Interactive Maps**: Leaflet.js visualization of flight paths and sun positions
- **Modern UI**: Beautiful, responsive design matching the provided mockups
- **Airport Data**: External API integration for worldwide airport coordinates

## 🚀 Tech Stack

### Frontend
- **Next.js** - React framework for production
- **React Icons** - Beautiful icon library
- **Leaflet.js** - Interactive maps
- **Axios** - HTTP client

### Backend
- **Express.js** - Web application framework
- **Turf.js** - Geospatial analysis
- **SunCalc** - Sun position calculations
- **Node-cache** - In-memory caching
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scenic-seat-recommender.git
   cd scenic-seat-recommender
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Backend (.env in backend/ folder):**
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `.env` and add your airport API key:
   ```
   AIRPORT_API_KEY=your_aviationstack_api_key
   AIRPORT_API_URL=https://api.aviationstack.com/v1
   PORT=4000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend (.env.local in frontend/ folder):**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   NEXT_PUBLIC_PORT=3000
   ```

4. **Get an API key** (for airport data)
   - Sign up at [AviationStack](https://aviationstack.com/) 
   - Get your free API key
   - Add it to `backend/.env`

## 🏃‍♂️ Running the Application

### Development Mode

**Option 1: Run both frontend and backend together**
```bash
npm run dev
```

**Option 2: Run separately**

Backend only:
```bash
npm run dev:backend
```

Frontend only:
```bash
npm run dev:frontend
```

### Production Mode

**Build the frontend:**
```bash
npm run build
```

**Start both services:**
```bash
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api

## 📁 Project Structure

```
scenic-seat-recommender/
├── backend/
│   ├── src/
│   │   ├── index.js           # Express server entry point
│   │   ├── routes/
│   │   │   └── flight.js      # Flight recommendation API
│   │   └── services/
│   │       ├── airportService.js    # Airport data fetching
│   │       ├── flightPathService.js # Great-circle calculations
│   │       └── sunService.js        # Sun position calculations
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── pages/
│   │   ├── index.js           # Landing page with form
│   │   ├── results.js         # Results page with map
│   │   └── _app.js            # Next.js app configuration
│   ├── components/
│   │   ├── Map.js             # Leaflet map component
│   │   └── Recommendation.js   # Seat recommendation display
│   ├── styles/
│   │   └── global.css         # Global styles
│   ├── next.config.js         # Next.js configuration
│   ├── package.json
│   └── .env.example
├── package.json               # Root package.json with scripts
└── README.md
```

## 🔧 API Endpoints

### POST /api/flight
Get seat recommendation and flight path data.

**Request Body:**
```json
{
  "departure": "JFK",
  "arrival": "LAX", 
  "datetime": "2024-01-15T10:30:00"
}
```

**Response:**
```json
{
  "recommendation": "left",
  "path": [
    {"lat": 40.6413, "lon": -73.7781},
    {"lat": 40.5, "lon": -74.0},
    ...
  ],
  "sunPositions": [
    {"lat": 40.6413, "lon": -73.7781, "azimuth": 1.2, "altitude": 0.3},
    ...
  ]
}
```

## 🎨 Design Features

The frontend faithfully implements the provided design mockups including:

- **Hero Section**: Gradient background with animated icons
- **Feature Highlights**: Three-column grid with colored icons
- **Statistics Section**: Impressive metrics display
- **Testimonials**: User review with avatar and rating
- **Form Section**: Clean, modern input form with icons
- **Responsive Design**: Mobile-first approach

## 🔒 Security

- Helmet.js for security headers
- CORS configuration
- Input validation
- Rate limiting ready (can be added)

## 📈 Performance

- In-memory caching for airport data
- Optimized API calls
- Responsive images
- Minimal bundle size

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd frontend
vercel --prod
```

### Heroku (Backend)
```bash
cd backend
git init
heroku create your-app-name
git add .
git commit -m "Initial commit"
git push heroku main
```

### Environment Variables for Production
Don't forget to set your environment variables in your deployment platform!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [AviationStack](https://aviationstack.com/) for airport data API
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles
- [Turf.js](https://turfjs.org/) for geospatial calculations
- [SunCalc](https://github.com/mourner/suncalc) for astronomical calculations

---

Made with ❤️ for travelers who love scenic views ✈️🌅