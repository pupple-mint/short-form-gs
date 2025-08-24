import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, HeartIcon, HeartOutlineIcon, UploadIcon } from './components/Icons';
import './App.css';

function App() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
      updateSliderProgress(current, duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      updateSliderProgress(currentTime, dur);
    }
  };

  const handleSeek = (event: Event | React.ChangeEvent<HTMLInputElement>, newValue: number | number[]) => {
    const time = typeof newValue === 'number' ? newValue : newValue[0];
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const updateSliderProgress = (current: number, total: number) => {
    const progress = total > 0 ? (current / total) * 100 : 0;
    const slider = document.querySelector('.video-slider') as HTMLElement;
    if (slider) {
      slider.style.setProperty('--progress', `${progress}%`);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="main-container">
      <div className="content-wrapper">
        {!videoSrc ? (
          <div className="upload-paper">
            <UploadIcon size={60} className="upload-icon" />
            <h2 className="upload-title">
              동영상 업로드
            </h2>
            <p className="upload-description">
              숏폼 동영상을 선택해주세요
            </p>
            <button
              onClick={handleUploadClick}
              className="upload-button"
            >
              동영상 선택
            </button>
          </div>
        ) : (
          <div className="video-paper">
            <div className="video-container">
              <video
                ref={videoRef}
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="video-element"
                onClick={togglePlayPause}
              />
              
              {/* Like Button - Bottom Right */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`like-button ${isLiked ? 'liked' : ''}`}
              >
                {isLiked ? <HeartIcon size={29} /> : <HeartOutlineIcon size={29} />}
              </button>

              {/* Video Controls */}
              <div className="video-controls">
                <div className="controls-row">
                  <button
                    onClick={togglePlayPause}
                    className="play-button"
                  >
                    {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
                  </button>
                  
                  <span className="time-display">
                    {formatTime(currentTime)}
                  </span>
                  
                  <input
                    type="range"
                    value={currentTime}
                    max={duration}
                    onChange={(e) => handleSeek(e as any, Number(e.target.value))}
                    className="video-slider"
                  />
                  
                  <span className="time-display">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {videoSrc && (
          <div className="new-upload-section">
            <button
              onClick={handleUploadClick}
              className="new-upload-button"
            >
              <UploadIcon size={16} />
              <span>새 동영상 업로드</span>
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="hidden-input"
        />
      </div>
    </div>
  );
}

export default App;
