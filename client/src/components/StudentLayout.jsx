import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import './StudentLayout.css';

const quotes = [
  "You're doing amazing 🤩",
  "Stay hydrated 💧",
  "Your future self is proud 🌟",
  "One step at a time 🐾",
  "Coding today, conquering tomorrow 🚀"
];

const StudentLayout = ({ children }) => {
  const student = JSON.parse(localStorage.getItem('studentInfo')) || {};
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState('');
  const [greeting, setGreeting] = useState('');
  const [confetti, setConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const hour = new Date().getHours();
    if (student?.name) {
      if (hour < 12) setGreeting(`🌅 Good Morning, ${student.name}`);
      else if (hour < 17) setGreeting(`☀️ Good Afternoon, ${student.name}`);
      else setGreeting(`🌙 Good Evening, ${student.name}`);
    } else {
      setGreeting('👋 Welcome, Student!');
    }

    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  }, []);

  const handleAvatarClick = () => {
    const audio = new Audio('/pop.mp3'); // Make sure you have this sound in public/
    audio.play();
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className="student-layout">
      {confetti && <Confetti width={width} height={height} />}
      <aside className="student-sidebar">
        <div
          className="student-avatar"
          onMouseEnter={() => setShowQuote(true)}
          onMouseLeave={() => setShowQuote(false)}
          onClick={handleAvatarClick}
        >
          <span role="img" aria-label="bot">🤖</span>
          {showQuote && <div className="quote-slide">{quote}</div>}
        </div>
        <p className="greeting">{greeting}</p>
        <nav>
          <a href="/student/dashboard">🏠 Dashboard</a>
          <a href="/student/status">📋 Leave Status</a>
          <a href="/" onClick={() => {
            localStorage.removeItem('studentToken');
            localStorage.removeItem('studentInfo');
          }}>🚪 Logout</a>
        </nav>
      </aside>
      <main className="student-main">{children}</main>
    </div>
  );
};

export default StudentLayout;
