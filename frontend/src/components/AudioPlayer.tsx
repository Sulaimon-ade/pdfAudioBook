import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Download, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  fileName: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, fileName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = fileName.replace('.pdf', '.mp3');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-cream rounded-xl p-6 border border-amber-200 shadow-lg">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-amber-900">
          {fileName.replace('.pdf', '')} - Audiobook
        </h3>
        <button
          onClick={downloadAudio}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-800 text-cream rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max="100"
          value={duration ? (currentTime / duration) * 100 : 0}
          onChange={handleSeek}
          className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-sm text-amber-700 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6 mb-4">
        <button
          onClick={() => skipTime(-10)}
          className="p-3 hover:bg-amber-100 rounded-full transition-colors"
        >
          <SkipBack className="h-5 w-5 text-amber-800" />
        </button>

        <button
          onClick={togglePlayPause}
          className="p-4 bg-amber-800 text-cream rounded-full hover:bg-amber-700 transition-colors shadow-lg"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </button>

        <button
          onClick={() => skipTime(10)}
          className="p-3 hover:bg-amber-100 rounded-full transition-colors"
        >
          <SkipForward className="h-5 w-5 text-amber-800" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center space-x-3">
        <Volume2 className="h-5 w-5 text-amber-700" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    </div>
  );
};