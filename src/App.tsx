import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  Slider, 
  Typography,
  Container,
  Paper
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  Favorite, 
  FavoriteBorder,
  CloudUpload 
} from '@mui/icons-material';
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
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (event: Event, newValue: number | number[]) => {
    const time = newValue as number;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
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
    <Container maxWidth="sm" className="main-container">
      <Box className="content-wrapper">
        {!videoSrc ? (
          <Paper 
            elevation={3}
            className="upload-paper"
          >
            <CloudUpload className="upload-icon" />
            <Typography variant="h5" gutterBottom>
              동영상 업로드
            </Typography>
            <Typography variant="body1" className="upload-description">
              숏폼 동영상을 선택해주세요
            </Typography>
            <Button
              variant="contained"
              onClick={handleUploadClick}
              className="upload-button"
            >
              동영상 선택
            </Button>
          </Paper>
        ) : (
          <Paper 
            elevation={6}
            className="video-paper"
          >
            <Box className="video-container">
              <video
                ref={videoRef}
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="video-element"
                onClick={togglePlayPause}
              />
              
              {/* Like Button - Bottom Right */}
              <IconButton
                onClick={() => setIsLiked(!isLiked)}
                className={`like-button ${isLiked ? 'liked' : ''}`}
              >
                {isLiked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>

              {/* Video Controls */}
              <Box className="video-controls">
                <Box className="controls-row">
                  <IconButton
                    onClick={togglePlayPause}
                    className="play-button"
                  >
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  
                  <Typography variant="caption" className="time-display">
                    {formatTime(currentTime)}
                  </Typography>
                  
                  <Slider
                    value={currentTime}
                    max={duration}
                    onChange={handleSeek}
                    className="video-slider"
                  />
                  
                  <Typography variant="caption" className="time-display">
                    {formatTime(duration)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}

        {videoSrc && (
          <Box className="new-upload-section">
            <Button
              variant="outlined"
              onClick={handleUploadClick}
              startIcon={<CloudUpload />}
              className="new-upload-button"
            >
              새 동영상 업로드
            </Button>
          </Box>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="hidden-input"
        />
      </Box>
    </Container>
  );
}

export default App;
