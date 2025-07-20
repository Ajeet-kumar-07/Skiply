import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import './StudentAvatarMenu.css'; // Styles

const quotes = [
  "🌟 You're doing great!",
  "🍀 Keep going, legend!",
  "🚀 Let’s conquer this semester!",
  "🧠 Brains & vibes, activated!",
  "🥳 Login like a boss!"
];

const greetings = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  else if (hour < 17) return 'Good Afternoon';
  else return 'Good Evening';
};

const StudentAvatarMenu = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  const [quote, setQuote] = useState(quotes[0]);
  const [showConfetti, setShowConfetti] = useState(true);
  const [theme, setTheme] = useState('light');
  const [playSound, setPlaySound] = useState(false);

  const user = JSON.parse(localStorage.getItem('studentInfo')) || {};
  const greeting = `${greetings()}, ${user.name?.split(' ')[0] || 'Student'} 👋`;

  useEffect(() => {
    // Confetti for 2 seconds on login
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Rotate quote every 4 seconds
    const rotator = setInterval(() => {
      setQuote(prev => {
        let next;
        do {
          next = quotes[Math.floor(Math.random() * quotes.length)];
        } while (next === prev);
        return next;
      });
    }, 4000);
    return () => clearInterval(rotator);
  }, []);

  useEffect(() => {
    if (playSound) {
      const audio = new Audio('/funny.mp3'); // Place in public folder
      audio.play().catch(() => {});
    }
  }, [playSound]);

  const handleClick = () => {
    setPlaySound(true);
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
    navigate('/student/dashboard');
  };

  return (
    <div className={`avatar-container ${theme}`}>
      {showConfetti && <Confetti width={width} height={height} />}
      <div className="avatar-wrapper" onClick={handleClick}>
        {user.imageUrl ? (
          <img src={user.imageUrl} alt="avatar" className="avatar-img" />
        ) : (
          <div className="emoji-avatar">🤖</div>
        )}
        <div className="tooltip">
          <p>{greeting}</p>
          <p style={{ fontSize: '0.9em', marginTop: '5px', opacity: 0.8 }}>{quote}</p>
        </div>
        <span className="ripple" />
      </div>
    </div>
  );
};

export default StudentAvatarMenu;
