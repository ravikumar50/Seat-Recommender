import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
// Dynamically import Map with no SSR
const Map = dynamic(() => import('../components/Map'), { ssr: false });
import Recommendation from '../components/Recommendation';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaChevronDown, FaPlane, FaSearch } from 'react-icons/fa';
import { FiSun, FiMapPin, FiClock } from 'react-icons/fi';
import { IoShieldCheckmark, IoFlashSharp, IoGlobeOutline } from 'react-icons/io5';

export default function Home() {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [preference, setPreference] = useState('');
  const [depSuggestions, setDepSuggestions] = useState([]);
  const [arrSuggestions, setArrSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [results, setResults] = useState(null);
  const [resLoading, setResLoading] = useState(false);
  const [resError, setResError] = useState(null);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Window Seat';
  const countersRef = useRef({ started: false });

  // Testimonial slider state
  const testimonials = [
    { quote: "I never realized how much I was missing until I started using this app. Every flight is now a scenic experience.", author: "Marcus Rodriguez", title: "Business Traveler", rating: 5 },
    { quote: "This tool changed how I book my flights. Perfect views every time!", author: "Sarah Lee", title: "Backpacker", rating: 4 },
    { quote: "Amazing service and accurate recommendations. Highly recommend.", author: "Tom Alvarez", title: "Photographer", rating: 5 },
  ];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSlide(s => (s+1)%testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Typed effect for hero title
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i += 1;
      if (i >= fullText.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const datetime = date + 'T' + time;
    setResLoading(true);
    setResError(null);
    setResults(null); // Clear previous results when starting new search
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/flight`, { departure, arrival, datetime });
      setResults(res.data);
      // scroll to results
      document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setResError(err.response?.data?.error || err.message);
    } finally {
      setResLoading(false);
    }
  };

  function fetchSuggestionsWithDebounce(value, setter) {
    // Clear existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const q = value.trim();
    if (q.length < 2) { 
      setter([]); 
      return; 
    }
    
    // Set new timeout for debounced search
    const timeoutId = setTimeout(async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        console.log('Fetching suggestions for:', q, 'from:', `${apiUrl}/flight/search`);
        console.log('Full API URL:', `${apiUrl}/flight/search?q=${encodeURIComponent(q)}&limit=6`);
        const res = await fetch(`${apiUrl}/flight/search?q=${encodeURIComponent(q)}&limit=6`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        console.log('API response:', json);
        
        setter(json.results || json || []);
      } catch (e) {
        console.error('Error fetching suggestions:', e);
        console.error('Error details:', e.message);
        setter([]);
      }
    }, 300); // 300ms debounce
    
    setDebounceTimeout(timeoutId);
  }

  useEffect(() => {
    // Animated counters when stats section enters viewport
    const counters = document.querySelectorAll('.stat-number');
    if (countersRef.current.started || counters.length === 0) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersRef.current.started) {
          countersRef.current.started = true;
          counters.forEach(counter => {
            const targetText = counter.textContent || '';
            // Extract numeric value from text like '98.7%', '2.3M', '24/7', 'OK+'
            let endValue = 0;
            let suffix = '';
            if (targetText.includes('%')) { endValue = parseFloat(targetText); suffix = '%'; }
            else if (targetText.includes('M')) { endValue = parseFloat(targetText); suffix = 'M'; }
            else if (targetText.includes('/')) { endValue = 24; suffix = '/7'; }
            else if (targetText.includes('+')) { endValue = 1000; suffix = 'K+'; }
            else { endValue = parseFloat(targetText) || 0; }

            const duration = 1200;
            const start = performance.now();
            function step(now) {
              const progress = Math.min((now - start) / duration, 1);
              const value = endValue * progress;
              let display = value.toFixed(suffix === '%' ? 1 : 0) + (suffix || '');
              counter.textContent = display;
              if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          });
        }
      });
    }, { threshold: 0.3 });
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) observer.observe(statsSection);
    return () => observer.disconnect();
  }, []);



  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">
            <FaPlane className="plane-icon" />
            <FiSun className="sun-icon" />
          </div>
          <h1 className="hero-title">
            Find Your Perfect <br />
            <span className="gradient-text typed">{typedText}</span>
            <span className="caret">|</span>
          </h1>
          <p className="hero-subtitle">
            Never miss another stunning sunrise or sunset from your airplane window. 
            Get personalized seat recommendations based on your flight path and sun position.
          </p>
          <div className="hero-features">
            <div className="feature-item">
              <FiMapPin /> Real-time flight paths
            </div>
            <div className="feature-item">
              <FiSun /> Sun position tracking
            </div>
            <div className="feature-item">
              <FaPlane /> Smart seat recommendations
            </div>
          </div>
        </div>
      </section>

      {/* Form Section - Moved right after hero */}
      <section className="form-section">
        <div className="form-container">
          <h2 className="form-title">
            <FaPlane className="title-icon" /> Plan Your Scenic Flight
          </h2>
          
          <form className="flight-form" onSubmit={handleSubmit} id="flight-form">
            <div className="form-grid">
              {/* From field */}
              <div className="form-field autocomplete">
                <label className="field-label cyan">
                  <FaMapMarkerAlt /> From
                </label>
                <input 
                  type="text" 
                  placeholder="Departure IATA or City" 
                  value={departure} 
                  onChange={e => {
                    const v = e.target.value;
                    setDeparture(v);
                    fetchSuggestionsWithDebounce(v, setDepSuggestions);
                  }} 
                  required 
                />
                {depSuggestions.length > 0 && (
                  <ul className="suggestions">
                    {depSuggestions.map(s => (
                      <li key={s.iata} onClick={() => { setDeparture(s.iata); setDepSuggestions([]); }}>
                        <FaSearch /> {s.iata} — {s.name || s.city || ''} {s.country ? `(${s.country})` : ''}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* To field */}
              <div className="form-field autocomplete">
                <label className="field-label green">
                  <FaMapMarkerAlt /> To
                </label>
                <input 
                  type="text" 
                  placeholder="Destination IATA or City" 
                  value={arrival} 
                  onChange={e => {
                    const v = e.target.value;
                    setArrival(v);
                    fetchSuggestionsWithDebounce(v, setArrSuggestions);
                  }} 
                  required 
                />
                {arrSuggestions.length > 0 && (
                  <ul className="suggestions">
                    {arrSuggestions.map(s => (
                      <li key={s.iata} onClick={() => { setArrival(s.iata); setArrSuggestions([]); }}>
                        <FaSearch /> {s.iata} — {s.name || s.city || ''} {s.country ? `(${s.country})` : ''}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="form-field">
                <label className="field-label blue">
                  <FaCalendarAlt /> Departure Date
                </label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="form-field">
                <label className="field-label purple">
                  <FaClock /> Departure Time
                </label>
                <input 
                  type="time" 
                  value={time} 
                  onChange={e => setTime(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-field-full">
              <label className="field-label">View Preference (Optional)</label>
              <div className="select-wrapper">
                <select 
                  value={preference} 
                  onChange={e => setPreference(e.target.value)}
                  className="preference-select"
                >
                  <option value="">What would you like to see?</option>
                  <option value="sunrise">Sunrise</option>
                  <option value="sunset">Sunset</option>
                  <option value="landscape">Landscape</option>
                </select>
                <FaChevronDown className="select-icon" />
              </div>
            </div>
            
            <button type="submit" className="submit-button">
              <FaPlane className="button-icon" />
              Find My Perfect Seat
            </button>
          </form>
        </div>
      </section>

      {/* Results Section - Right after form */}
      <section id="results" className="results-section">
        {resLoading && <div className="loading">Loading recommendation...</div>}
        {resError && <div className="error-text">Error: {resError}</div>}
        {results && (
          <>
            <Recommendation 
              recommendation={results.recommendation} 
              reason={results.reason}
              confidence={results.confidence}
              flightInfo={results.flightInfo}
              sunInfo={results.sunInfo}
            />
            <button 
              onClick={() => {
                setResults(null);
                setResError(null);
                document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: 'linear-gradient(90deg, #00bcd4, #4caf50)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontWeight: '600'
              }}
            >
              🔍 New Search
            </button>
          </>
        )}
      </section>

      {/* Why Choose Section */}
      <section className="why-choose-section">
        <h2 className="section-title gradient-text">Why Choose SkyView Seats?</h2>
        <p className="section-subtitle">
          Transform your flight experience with intelligent seat selection powered by 
          advanced astronomical calculations and real-time data
        </p>
        
        <div className="airplane-icon">
          <FaPlane />
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon orange">
              <FiSun />
            </div>
            <h3>Perfect Sun Positioning</h3>
            <p>Advanced calculations ensure you catch the best sunrise and sunset views during your flight.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue">
              <FiMapPin />
            </div>
            <h3>Real Flight Paths</h3>
            <p>Accurate great-circle route calculations for precise seat recommendations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple">
              <FiClock />
            </div>
            <h3>Time-Perfect</h3>
            <p>Real-time calculations based on your exact departure time and flight duration.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number green">98.7%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number blue">2.3M</div>
            <div className="stat-label">Happy Travelers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number purple">OK+</div>
            <div className="stat-label">Flight Routes</div>
          </div>
          <div className="stat-item">
            <div className="stat-number orange">24/7</div>
            <div className="stat-label">Global Coverage</div>
          </div>
        </div>

        <h2 className="section-title gradient-text">Loved by Travelers Worldwide</h2>
        <p className="section-subtitle">
          Join thousands of satisfied travelers who never miss a scenic moment
        </p>
      </section>

      {/* Testimonial Slider Section */}
      <section className="testimonial-section">
        <div className="testimonial-slider" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {testimonials.map((t, idx) => (
            <div className="testimonial-item" key={idx}>
              <div className="quote-icon">"</div>
              <blockquote>{t.quote}</blockquote>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {/* Using initials as avatars since we don't have real images */}
                  <div className={`avatar-initials avatar-${idx % 4}`}>
                    {t.author.split(' ').map(name => name[0]).join('')}
                  </div>
                </div>
                <div className="author-info">
                  <div className="author-name">{t.author}</div>
                  <div className="author-title">{t.title}</div>
                  <div className="author-rating">{'⭐'.repeat(t.rating)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="testimonial-dots">
          {testimonials.map((_, idx) => (
            <span key={idx} className={`dot ${slide === idx ? 'active' : ''}`} onClick={() => setSlide(idx)} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-highlight">
        <div className="features-grid-2">
          <div className="feature-highlight">
            <div className="feature-icon-large green">
              <IoShieldCheckmark />
            </div>
            <h3>Weather Integration</h3>
            <p>Cloud cover and weather data to maximize your viewing chances</p>
          </div>
          <div className="feature-highlight">
            <div className="feature-icon-large orange">
              <IoFlashSharp />
            </div>
            <h3>Instant Results</h3>
            <p>Get seat recommendations in seconds with confidence scores</p>
          </div>
          <div className="feature-highlight">
            <div className="feature-icon-large blue">
              <IoGlobeOutline />
            </div>
            <h3>Global Coverage</h3>
            <p>Supporting flights worldwide with local astronomical data</p>
          </div>
        </div>
        
        <button className="cta-button" onClick={() => document.getElementById('flight-form').scrollIntoView({ behavior: 'smooth' })}>
          Start Your Perfect Flight Journey
        </button>
      </section>

      {/* Map Section - At the bottom */}
      {results && (
        <section className="map-section">
          <h2>Flight Path Map</h2>
          <Map path={results.path} sunPositions={results.sunPositions} />
        </section>
      )}
    </div>
  );
}