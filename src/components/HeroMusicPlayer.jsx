import {
  Heart,
  Pause,
  Play,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import rainTrack from "../assets/KIAH - When It Rains.mp3";

const frequencyBars = [0.42, 0.74, 0.54, 0.92, 0.66, 0.36, 0.86, 0.58, 0.78, 0.48, 0.68];
const heartBursts = [
  { x: -20, y: -26, delay: 0 },
  { x: 18, y: -30, delay: 40 },
  { x: -8, y: -42, delay: 80 },
  { x: 28, y: -16, delay: 120 },
  { x: -26, y: -12, delay: 150 },
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export default function HeroMusicPlayer() {
  const audioRef = useRef(null);
  const heartTimerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [heartBurstKey, setHeartBurstKey] = useState(0);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const progressStyle = useMemo(
    () => ({ "--range-progress": `${progress}%` }),
    [progress],
  );

  useEffect(
    () => () => {
      if (heartTimerRef.current) {
        window.clearTimeout(heartTimerRef.current);
      }
    },
    [],
  );

  const handleMusicToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const handleProgressChange = (event) => {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);
    setCurrentTime(nextTime);

    if (audio) {
      audio.currentTime = nextTime;
    }
  };

  const handleLike = () => {
    setIsLiked((current) => !current);
    setHeartBurstKey((current) => current + 1);

    if (heartTimerRef.current) {
      window.clearTimeout(heartTimerRef.current);
    }
    heartTimerRef.current = window.setTimeout(() => {
      setHeartBurstKey(0);
    }, 900);
  };

  return (
    <div className="poster-music-control" id="hero-audio">
      <div className="poster-player-track">
        <div className="poster-progress-wrap">
          <span className="poster-track-time" aria-hidden="true">
            {formatTime(currentTime)}
          </span>
          <input
            className="poster-range poster-progress-range"
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={Math.min(currentTime, duration || 0)}
            onChange={handleProgressChange}
            style={progressStyle}
            aria-label="Track progress"
          />
        </div>

        <div className="poster-player-actions">
          <button
            className={`poster-heart-button${isLiked ? " is-liked" : ""}`}
            type="button"
            onClick={handleLike}
            aria-label={isLiked ? "Unlike this track" : "Like this track"}
          >
            <Heart size={23} weight={isLiked ? "fill" : "regular"} />
            {heartBurstKey > 0 ? (
              <span className="heart-burst" key={heartBurstKey} aria-hidden="true">
                {heartBursts.map((item, index) => (
                  <i
                    key={`${item.x}-${item.y}-${index}`}
                    style={{
                      "--heart-x": `${item.x}px`,
                      "--heart-y": `${item.y}px`,
                      "--heart-delay": `${item.delay}ms`,
                    }}
                  />
                ))}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <button
        className={`poster-play-button${isPlaying ? " is-playing" : ""}`}
        type="button"
        onClick={handleMusicToggle}
        aria-label={isPlaying ? "Pause When It Rains" : "Play When It Rains"}
      >
        {isPlaying ? (
          <Pause size={22} weight="fill" />
        ) : (
          <Play size={22} weight="fill" />
        )}
      </button>

      <div
        className={`poster-audio-frequency${isPlaying ? " is-visible" : ""}`}
        aria-hidden="true"
      >
        {frequencyBars.map((scale, index) => (
          <span
            key={`${scale}-${index}`}
            style={{
              "--bar-height": `${Math.round(scale * 26)}px`,
              "--bar-delay": `${index * -72}ms`,
            }}
          />
        ))}
      </div>

      <audio
        ref={audioRef}
        src={rainTrack}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />
    </div>
  );
}
