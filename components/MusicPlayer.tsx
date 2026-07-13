"use client";

import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { tracks } from "@/content";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, trackIndex]);

  const [prevTrackIndex, setPrevTrackIndex] = useState(trackIndex);
  if (trackIndex !== prevTrackIndex) {
    setPrevTrackIndex(trackIndex);
    setCurrentTime(0);
    setDuration(0);
  }

  if (tracks.length === 0) return null;

  const track = tracks[trackIndex];

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const goToNext = () => setTrackIndex((prev) => (prev + 1) % tracks.length);
  const goToPrevious = () =>
    setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-6 right-6 z-20 w-56 rounded-lg border border-border bg-background/80 p-4 font-mono text-xs backdrop-blur-sm md:w-72">
      <audio
        ref={audioRef}
        src={`/assets/music/${track.file}`}
        muted={isMuted}
        onEnded={goToNext}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />
      <p className="text-accent">$ now_playing</p>
      <p className="mt-1 truncate text-foreground/70">
        {track.title} — {track.artist}
      </p>
      <div
        className="mt-3 hidden h-1 cursor-pointer rounded-full bg-foreground/20 md:block"
        onClick={handleSeek}
      >
        <div
          className="h-1 rounded-full bg-accent"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 hidden justify-between text-foreground/40 md:flex">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Previous track"
          className="hidden md:inline-flex"
        >
          <SkipBack size={16} />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          type="button"
          onClick={goToNext}
          aria-label="Next track"
          className="hidden md:inline-flex"
        >
          <SkipForward size={16} />
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}
