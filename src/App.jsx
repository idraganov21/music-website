import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import LoginPage from './components/LoginPage/LoginPage';
import Contacts from './components/Contact/Contacts';
import Podcasts from './components/Podcasts/Podcasts';
import Music from './components/Music/Music';
import Profile from './components/Profile/Profile';
import HomeNotLogged from './components/HomeNotLogged/HomeNotLogged';
import AccessDenied from './components/accessDenied/accessDenied';
import ReactGA from 'react-ga';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginHeader from './components/LoginHeader/LoginHeader';
import LoginFooter from './components/LoginFooter/LoginFooter';

const TRACKING_ID = "G-JRPCJGTLQC";
ReactGA.initialize(TRACKING_ID);

function App() {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [lastMessageCount, setLastMessageCount] = useState(0);

    const fetchMessages = async () => {
      try {
          // Fetch messages for the logged-in user
          const response = await fetch(`http://localhost:1337/api/messages`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const userMessages = data.data.map(item => ({
              id: item.id,
              details: item.attributes.message[0].children[0].text,
              expanded: false,
              read: item.attributes.read,
          }));

          setMessages(userMessages);
      } catch (error) {
          console.error('Error fetching messages:', error);
      }
  };

useEffect(() => {
  const storedUsername = localStorage.getItem('username') || '';
  setUsername(storedUsername);

  fetchMessages();
  const interval = setInterval(fetchMessages, 100000); // Poll every 5 minutes
  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);


  return (
    <Router>
      <ToastContainer />
      <main>
        <Routes>
          {/* Redirect the root path to the login page */}
          <Route path="/" element={<Navigate replace to="/homenotlogged" />} />
          {/* Route for the home page after successful login */}
          <Route path="/home" element={<><Header messages={messages}  /><Home /><Footer /></>} />
          <Route path="/homenotlogged" element={<><LoginHeader messages={messages}  /><HomeNotLogged /><LoginFooter /></>} />
          {/* Route for the login page */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/music" element={<><Header  messages={messages} /><Music /><Footer /></>} />

          {/* <Route path="https://relaxmashmusic.org/vanilla/" /> */}
          <Route path="/podcasts" element={<><Header   messages={messages} /><Podcasts /><Footer /></>} />
          <Route path="/contacts" element={<><Header  messages={messages} /><Contacts /><Footer /></>} />
          <Route path="/profile" element={<><Header  /><Profile /><Footer /></>} />
          <Route path="/music" element={<><Header  messages={messages} /><Music /><Footer /></>} />
          <Route path="/access-denied" element={<AccessDenied />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
