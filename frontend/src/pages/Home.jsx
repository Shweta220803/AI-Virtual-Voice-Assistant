import React, { useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHistory, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import userImg from "../assets/user.gif";
import aiImg from "../assets/ai.gif";

function Home() {
  const { userData, BACKEND_URL, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState('');
  const [aiText, setAiText] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = synth.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) utterance.voice = hindiVoice;

    isSpeakingRef.current = true;
    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAiText('');
      startRecognition();
    };

    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);
    saveHistory(userInput);

    const query = encodeURIComponent(userInput);
    const openURL = (url) => window.open(url, '_blank');

    switch (type) {
      case 'google-search':
        openURL(`https://www.google.com/search?q=${query}`);
        break;
      case 'youtube-search':
      case 'youtube-play':
        openURL(`https://www.youtube.com/results?search_query=${query}`);
        break;
      case 'calculator-open':
        openURL('https://www.google.com/search?q=calculator');
        break;
      case 'instagram-open':
        openURL('https://www.instagram.com/');
        break;
      case 'facebook-open':
        openURL('https://www.facebook.com/');
        break;
      case 'weather-show':
        openURL('https://www.google.com/search?q=weather');
        break;
      default:
        break;
    }
  };

  const saveHistory = async (query) => {
    try {
      await axios.post(`${BACKEND_URL}/api/user/history`, { query }, { withCredentials: true });
    } catch (err) {
      console.error("History save failed:", err);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log(" Listening...", listening);
      } catch (error) {
        if (error.name !== 'InvalidStateError') console.error("Recognition start error:", error);
      }
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current && isMounted) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            if (e.name !== 'InvalidStateError') console.error(e);
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log("Transcript:", transcript);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        try {
          const data = await getGeminiResponse(transcript);
          setAiText(data.response);
          setUserText('');
          handleCommand(data);
        } catch (err) {
          console.error("Error from Gemini:", err);
        }
      }
    };

    const greet = new SpeechSynthesisUtterance(`Hello ${userData.name}, how can I help you today?`);
    greet.lang = 'hi-IN';
    synth.speak(greet);

    const timeout = setTimeout(() => startRecognition(), 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      recognition.stop();
    };
  }, []);

  const handleLogOut = async () => {
    try {
      await axios.get(`${BACKEND_URL}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate('/signin');
    } catch (err) {
      setUserData(null);
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col items-center px-4 pt-8 pb-20 text-white">
      {/* Assistant Image */}
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-4">
        <img src={userData?.assistantImage || userImg} alt="Assistant" className="w-full h-full object-cover" />
      </div>

      {/* Assistant Name & Speaking GIF */}
      <h1 className="text-xl font-bold mb-2">I'm {userData?.assistantName}</h1>
      <img src={aiText ? aiImg : userImg} alt="Status" className="w-24 h-24 mb-2" />
      <p className="text-center text-base">{userText || aiText || "Say something..."}</p>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <button onClick={() => setShowHistory(prev => !prev)} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-semibold">
          <FaHistory /> History {showHistory ? <HiChevronUp /> : <HiChevronDown />}
        </button>
        <button onClick={() => setShowCustomize(prev => !prev)} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-semibold">
          <FaUserEdit /> Customize {showCustomize ? <HiChevronUp /> : <HiChevronDown />}
        </button>
        <button onClick={handleLogOut} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* History */}
      {showHistory && (
        <div className="mt-6 w-full max-w-md bg-white bg-opacity-10 rounded-xl p-4 overflow-y-auto max-h-64 backdrop-blur-lg">
          <h2 className="text-lg font-bold text-center mb-2">Your History</h2>
          {userData?.history?.length > 0 ? (
            userData.history.slice().reverse().map((item, idx) => (
              <p key={idx} className="text-sm text-gray-300 border-b py-1">{item}</p>
            ))
          ) : (
            <p className="text-gray-400 text-center">No history found.</p>
          )}
        </div>
      )}

      {/* Customize Option */}
      {showCustomize && (
        <div className="mt-6 w-full max-w-md bg-white bg-opacity-10 rounded-xl p-4 text-center backdrop-blur-lg">
          <p className="mb-2">Want to customize your assistant?</p>
          <button onClick={() => navigate("/customize")} className="bg-blue-500 text-white px-4 py-2 rounded-full">Go to Customization</button>
        </div>
      )}
    </div>
  );
}

export default Home;
