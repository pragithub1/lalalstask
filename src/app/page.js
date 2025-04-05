// pages/index.js
"use client";
// pages/_app.js or app/layout.js
import 'bootstrap/dist/css/bootstrap.min.css';


import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, 
  Heart, Download, MoreHorizontal, ChevronUp, X, Copy 
} from 'lucide-react';
import './globals.css'; // adjust path as needed


// Sample music data
const musicData = [
  {
    id: 1,
    title: 'Blame It',
    artist: '@justinflame',
    plays: '58K',
    likes: '33K',
    description: 'a chilled house track with vocals and vocal chops in...',
    coverImage: '/images/music1.jpg',
    audio: '/audio/music1.mp3',
  },
  {
    id: 2,
    title: 'Funk Train',
    artist: '@musicgpt',
    plays: '19K',
    likes: '12K',
    description: 'a modern funk style track with male vocals and...',
    coverImage: '/images/music2.jpg',
    audio: '/audio/music2.mp3',
  },
  {
    id: 3,
    title: '4th One',
    artist: '@musicgpt',
    plays: '37K',
    likes: '28K',
    description: 'a dark sexy modern R&B track with pop influences...',
    coverImage: '/images/music3.jpg',
    audio: '/audio/music3.mp3',
  },
  {
    id: 4,
    title: 'Left Behind',
    artist: '@musicgpt',
    plays: '71K',
    likes: '23K',
    description: 'a dark sexy modern R&B track with pop influences...',
    coverImage: '/images/music4.jpg',
    audio: '/audio/music4.mp3',
  },
  // Add more tracks as needed
];

export default function Home() {
  // State for player and playlist
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showTrackMenu, setShowTrackMenu] = useState(null);


  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  
  // Reference for audio element
  const audioRef = useRef(null);

  
  const handleSliderChange = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };
  
  // Handle play/pause functionality
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  // Play specific track
  const playTrack = (track) => {
    setCurrentTrack(track);
    setPlayerVisible(true);
    setIsPlaying(true);
    
    // We need to wait for the state update and component render
    // before we can play the audio
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };
  
  // Handle next and previous track navigation
  const playNextTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = musicData.findIndex(track => track.id === currentTrack.id);
    let nextIndex;
    
    if (isShuffle) {
      // Get random track index (different from current)
      do {
        nextIndex = Math.floor(Math.random() * musicData.length);
      } while (nextIndex === currentIndex && musicData.length > 1);
    } else {
      // Get next track in playlist
      nextIndex = (currentIndex + 1) % musicData.length;
    }
    
    playTrack(musicData[nextIndex]);
  };
  
  const playPreviousTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = musicData.findIndex(track => track.id === currentTrack.id);
    let prevIndex;
    
    if (isShuffle) {
      // Get random track
      do {
        prevIndex = Math.floor(Math.random() * musicData.length);
      } while (prevIndex === currentIndex && musicData.length > 1);
    } else {
      // Get previous track, looping to the end if necessary
      prevIndex = (currentIndex - 1 + musicData.length) % musicData.length;
    }
    
    playTrack(musicData[prevIndex]);
  };
  
  // Toggle track menu
  const toggleTrackMenu = (id) => {
    if (showTrackMenu === id) {
      setShowTrackMenu(null);
    } else {
      setShowTrackMenu(id);
    }
  };
  
  // Close player
  const closePlayer = () => {
    setPlayerVisible(false);
    setIsPlaying(false);
    audioRef.current.pause();
  };
  
  // Listen for audio end to implement repeat and next functionality
  useEffect(() => {
    const handleAudioEnd = () => {
      if (isRepeat) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        playNextTrack();
      }
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnd);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, [isRepeat, currentTrack]);

  return (
    <div className="min-vh-100 bg-dark text-light">
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef} 
        src={currentTrack?.audio} 
        className="d-none"
      />
      
      {/* Track list */}
      <div className="px-4 mt-8 mx-auto" style={{ width: '70%'}}>
        {musicData.map((track) => (
          <div 
            key={track.id} 
            className="d-flex align-items-center py-4 position-relative"
          >
            <div 
              className="w-16 h-16 bg-secondary rounded cursor-pointer"
              onClick={() => playTrack(track)}
            >
              <div className="w-100 h-100 position-relative">
                {track.coverImage && (
                  <Image 
                    src={track.coverImage} 
                    alt={track.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                )}
              </div>
            </div>
            
            <div className="ms-4 flex-grow">
              <h5
                className="fw-bold cursor-pointer hover-underline"
                onClick={() => playTrack(track)}
              >
                {track.title}
              </h5>
              <p className="fs-6 text-darkOffwhite">{track.plays} Plays</p>
            </div>
            
            <div className="flex-grow max-w-md font-medium text-darkOffwhite">
              {track.description}
            </div>
            
            <div className="position-relative">
              <button 
                className="p-0 bg-transparent border-0 text-darkOffwhite hover:text-white"
                onClick={() => toggleTrackMenu(track.id)}
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              
              {/* Track menu dropdown */}
              {/* {showTrackMenu === track.id && (
                <div className="position-absolute start-0 top-100 mb-2 bg-dark text-light shadow-lg rounded w-48 z-index-10">
                  <div className="py-1">
                    <button className="w-100 text-start d-flex align-items-center px-4 py-2 hover:bg-secondary hover:text-white">
                      <Download className="h-4 w-4 me-2" /> Download
                    </button>
                    <button className="w-100 text-start d-flex align-items-center px-4 py-2 hover:bg-secondary hover:text-white">
                      <Copy className="h-4 w-4 me-2" /> Copy
                    </button>
                    <button className="w-100 text-start d-flex align-items-center px-4 py-2 hover:bg-secondary hover:text-white">
                      <span className="h-4 w-4 me-2">🎯</span> Use prompt
                    </button>
                    <button className="w-100 text-start d-flex align-items-center px-4 py-2 hover:bg-secondary hover:text-white text-danger">
                      <span className="h-4 w-4 me-2">⚠️</span> Report
                    </button>
                  </div>
                </div>
              )} */}

            </div>
          </div>
        ))}
      </div>
      
      {/* Player bar - animated to slide up when active */}
      <AnimatePresence >
        {playerVisible && currentTrack && (
          <motion.div
          //make this div slide up from the bottom and stops at the bottom of the page
            className="fixed-bottom mb-4 left-1/2 translate-x-[-50%] bg-dark text-light shadow-lg mx-auto rounded-lg border custom-light-border"
            style={{ width: '80vw'}} // Set the width to 80% of the viewport
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Audio Progress Slider */}
            <div className="position-relative" style={{ width: '100%'}}>
                <input 
                  type="range" 
                  className="form-range custom-slider"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSliderChange}
                  style={{
                    position: 'absolute',
                    top: 0, 
                    left: 11,
                    width: '98%',
                    height: '1px', // Thin slider
                    background: 'transparent', // Transparent background for slider track
                  }}
                />
            </div>
            <div className="d-flex justify-content-between">
              {/* Track info */}
              <div className="d-flex align-items-center rounded-lg" style={{ width: '25%'}}>
                <div className="bg-secondary position-relative custom-rounded-left" style={{zIndex: -1}}>
                  {currentTrack.coverImage && (
                    <Image 
                      src={currentTrack.coverImage} 
                      alt={currentTrack.title}
                      // layout="intrinsic"
                      width={120} // Set a maximum width if needed (optional)
                      height={120} // Set a maximum height if needed (optional)
                      // // objectFit="cover"
                      className="custom-rounded-left"
                    />
                  )}
                </div>
                <div className="ms-3">
                  <h4 className="fw-medium">{currentTrack.title}</h4>
                  <p className="fs-6">{currentTrack.artist}</p>
                </div>
              </div>
              
              {/* Player controls */}
              <div className="d-flex align-items-center"> 
                <button 
                  className={`p-2 ${isShuffle ? 'text-lightblue bg-transparent border-0' : 'hover:text-lightblue text-offwhite bg-transparent border-0'}`}
                  onClick={() => setIsShuffle(!isShuffle)}
                >
                  <Shuffle className="h-5 w-5" />
                </button>
                <button 
                  className="p-2 text-offwhite hover:text-lightblue bg-transparent border-0"
                  onClick={playPreviousTrack}
                >
                  <SkipBack className="h-5 w-5" />
                </button>
                <button 
                  className="p-3 text-offwhite hover:text-lightblue bg-transparent border-0"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 " />}
                </button>
                <button 
                  className="p-2 hover:text-lightblue text-offwhite bg-transparent border-0"
                  onClick={playNextTrack}
                >
                  <SkipForward className="h-5 w-5" />
                </button>
                <button 
                  className={`p-2 ${isRepeat ? 'text-lightblue bg-transparent border-0' : 'hover:text-lightblue text-offwhite bg-transparent border-0'}`}
                  onClick={() => setIsRepeat(!isRepeat)}
                >
                  <Repeat className="h-5 w-5" />
                </button>
              </div>
              
              {/* Right section - likes and close */}
              <div className="d-flex align-items-center space-x-3" style={{ width: '50px' }}>
                {/* <span className="fs-6">{currentTrack.likes}</span> */}
                {/* <Heart className="h-5 w-5 hover:text-white cursor-pointer" /> */}
                <div className="d-flex space-x-2">
                  {/* <button 
                    className="p-1 hover:bg-dark"
                    onClick={() => {}}
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button> */}
                  <button 
                    className="p-1 hover:text-lightblue text-offwhite bg-transparent border-0"
                    onClick={closePlayer}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {/* Audio element */}
              <audio 
                ref={audioRef}
                src={currentTrack.audio}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
