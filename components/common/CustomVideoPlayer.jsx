"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { MdVolumeOff, MdVolumeUp } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";

export default function CustomVideoPlayer({ url }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const playerRef = useRef(null);
  const [buffering, setBuffering] = useState(true);

  const handleBuffering = () => {
    setBuffering(true);
  };

  const handlePlaying = () => {
    setBuffering(false);
    setIsPlaying(true);
  };

  const handleCanPlayThrough = () => {
    setBuffering(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  const containerRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const containerTop = containerRef.current.offsetTop;
      const containerBottom = containerTop + containerRef.current.clientHeight;
      const scrollY = window.scrollY;

      if (scrollY < containerTop || scrollY > containerBottom) {
        setIsPlaying(false);
        if (playerRef.current) {
          playerRef.current.pause();
        }
      }
    }
  };

  useEffect(() => {
    const video = playerRef.current;
    video?.addEventListener("canplaythrough", handleCanPlayThrough);
    return () => {
      video?.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [playerRef.current]);

  useEffect(() => {
    const video = playerRef.current;
    video.addEventListener("waiting", handleBuffering);
    video.addEventListener("playing", handlePlaying);

    window.addEventListener("scroll", handleScroll);

    return () => {
      video.removeEventListener("waiting", handleBuffering);
      video.removeEventListener("playing", handlePlaying);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [playerRef.current]);

  const toggleMute = () => {
    setIsMute(!isMute);
  };

  return (
    <div className="relative h-100 w-100 bg-dark-3">
      <div
        className={`h-[100%] w-[100%] absolute cursor-pointer flex items-center justify-center z-10 transition-all ${
          isPlaying && "hover:opacity-100 opacity-0"
        }`}
        onClick={togglePlayPause}
      >
        {buffering ? (
          <div>
            <CircularProgress size={36} />
          </div>
        ) : isPlaying ? (
          <div>
            <FaCirclePause style={{ fontSize: "48px" }} color="#fff" />
          </div>
        ) : (
          <div className="transition-all">
            <FaCirclePlay style={{ fontSize: "48px" }} color="#fff" />
          </div>
        )}
      </div>
      <div
        className="absolute bottom-4 right-6 cursor-pointer flex items-center justify-center z-10"
        onClick={toggleMute}
      >
        {isMute ? (
          <div className="opacity-20">
            <MdVolumeOff style={{ fontSize: "24px" }} color="#fff" />
          </div>
        ) : (
          <div>
            <MdVolumeUp style={{ fontSize: "24px" }} color="#fff" />
          </div>
        )}
      </div>
      <div ref={containerRef}>
        <video
          ref={playerRef}
          src={url}
          className="h-[600px] max-md:h-[400px] w-100 object-center"
          playing={isPlaying}
          controls={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          muted={isMute}
          style={{
            display: "block", // Ensure it's a block-level element
            margin: "0 auto", // Auto margin horizontally centers the video
          }}
        />
      </div>
    </div>
  );
}
