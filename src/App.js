import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = SpeechRecognition ? new SpeechRecognition() : null;

if (mic) {
  mic.continuous = true;
  mic.interimResults = true;
  mic.lang = 'en-US';
}

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  const handleListen = useCallback(() => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log('continue..');
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log('Stopped Mic on Click');
      };
    }

    mic.onstart = () => {
      console.log('Mics on');
    };

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setNote(transcript);
      mic.onerror = event => {
        console.log(event.error);
      };
    };
  }, [isListening]); // Now it's included in the dependency array

  useEffect(() => {
    if (mic) {
      handleListen();
    }
  }, [isListening, handleListen]); // Add handleListen to the dependency array

  const handleSaveNote = () => {
    if (note.trim()) {
      setSavedNotes([...savedNotes, note]);
      setNote('');
    }
  };

  if (!SpeechRecognition) {
    return (
      <div>
        <h1>Voice Notes</h1>
        <p>Your browser does not support speech recognition. Please use a different browser like Chrome or Edge.</p>
      </div>
    );
  }

  return (
    <>
      <h1>Voice Notes</h1>
      <div className="container">
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Notes</h2>
          {savedNotes.map((n, index) => (
            <p key={index}>{n}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
