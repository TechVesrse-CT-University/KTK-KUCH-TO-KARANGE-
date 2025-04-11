import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdMic, MdStop, MdDelete, MdSend } from 'react-icons/md';
import './VoiceRecorder.css';

const VoiceRecorder = ({ onSendVoiceMessage, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  // Initialize voice recording
  const startRecording = () => {
    audioChunksRef.current = [];
    setRecordingTime(0);
    setTranscript('');
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // Set up MediaRecorder for audio
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.addEventListener('dataavailable', event => {
          audioChunksRef.current.push(event.data);
        });
        
        mediaRecorderRef.current.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
        });
        
        mediaRecorderRef.current.start();
        
        // Set up speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          speechRecognitionRef.current = new SpeechRecognition();
          speechRecognitionRef.current.continuous = true;
          speechRecognitionRef.current.interimResults = true;
          
          speechRecognitionRef.current.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
              } else {
                interimTranscript += transcript;
              }
            }
            
            setTranscript(finalTranscript || interimTranscript);
          };
          
          speechRecognitionRef.current.start();
        }
        
        // Start timer
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        
        setIsRecording(true);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        alert('Could not access your microphone. Please check your permissions and try again.');
      });
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      
      clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };
  
  const cancelRecording = () => {
    stopRecording();
    setTranscript('');
    setAudioBlob(null);
    onCancel();
  };
  
  const sendVoiceMessage = () => {
    if (transcript || audioBlob) {
      onSendVoiceMessage({
        text: transcript,
        audio: audioBlob ? URL.createObjectURL(audioBlob) : null
      });
      setTranscript('');
      setAudioBlob(null);
    }
  };
  
  // Format time display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      
      clearInterval(timerRef.current);
    };
  }, []);
  
  return (
    <motion.div 
      className="voice-recorder"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="voice-recorder-header">
        {isRecording ? (
          <div className="recording-status">
            <motion.div 
              className="recording-indicator"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <span>Recording ({formatTime(recordingTime)})</span>
          </div>
        ) : (
          <div className="recording-status">
            <span>{audioBlob ? 'Recording complete' : 'Ready to record'}</span>
          </div>
        )}
      </div>
      
      <div className="voice-recorder-content">
        {transcript && (
          <motion.div 
            className="transcript-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="transcript">{transcript}</p>
          </motion.div>
        )}
        
        {audioBlob && !isRecording && (
          <motion.div 
            className="audio-preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <audio src={URL.createObjectURL(audioBlob)} controls />
          </motion.div>
        )}
      </div>
      
      <div className="voice-recorder-controls">
        {isRecording ? (
          <motion.button 
            className="control-btn stop"
            onClick={stopRecording}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MdStop size={24} />
            <span>Stop</span>
          </motion.button>
        ) : audioBlob ? (
          <>
            <motion.button 
              className="control-btn delete"
              onClick={cancelRecording}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MdDelete size={24} />
              <span>Delete</span>
            </motion.button>
            
            <motion.button 
              className="control-btn send"
              onClick={sendVoiceMessage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MdSend size={24} />
              <span>Send</span>
            </motion.button>
          </>
        ) : (
          <>
            <motion.button 
              className="control-btn cancel"
              onClick={cancelRecording}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MdDelete size={24} />
              <span>Cancel</span>
            </motion.button>
            
            <motion.button 
              className="control-btn record"
              onClick={startRecording}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MdMic size={24} />
              <span>Record</span>
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default VoiceRecorder;
