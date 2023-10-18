"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { MdVolumeOff, MdVolumeUp } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";

export default function CustomVideoPlayer({ url }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const playerRef = useRef(null);
  const [buffering, setBuffering] = useState(false);

  const handleBuffering = () => {
    setBuffering(true);
  };


  const handlePlaying = () => {
    setBuffering(false);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    setBuffering(false);
    setIsPlaying(false);
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
    video.addEventListener("waiting", handleBuffering);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("ended", handleEnded);
    window.addEventListener("scroll", handleScroll);

    return () => {
      video.removeEventListener("waiting", handleBuffering);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("ended", handleEnded);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMute = () => {
    setIsMute(!isMute);
  };

  return (
    <div className="relative h-full w-full  rounded-lg">
      <div
        className={`h-full w-full absolute cursor-pointer flex items-center justify-center z-10 transition-all`}
        onClick={togglePlayPause}
      >
        {buffering ? (
          <div>
            <CircularProgress size={36} />
          </div>
        ) : (
          !isPlaying && (
            <div>
              <FaCirclePlay style={{ fontSize: "48px" }} color="#fff" />
            </div>
          )
        )}
      </div>
      <div
        className="absolute bottom-4 right-6 cursor-pointer flex items-center justify-center z-10 "
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
          className={`max-h-[600px] rounded-lg max-md:max-h-[400px] w-full max-md:object-cover
          object-contain`}
          autoPlay={isPlaying}
          controls={false}
          muted={isMute}
        />
      </div>
    </div>
  );
}
