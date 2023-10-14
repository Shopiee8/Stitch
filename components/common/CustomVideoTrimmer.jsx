// "use client";

// import Head from "next/head";
// import React, { useEffect, useRef, useState } from "react";
// import Nouislider from "nouislider-react";
// import "nouislider/distribute/nouislider.css";
// import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
// import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
// import ReactVideoTrimmer from "react-video-trimmer";
// import "react-video-trimmer/dist/style.css";
// export default function CustomVideoTrimmer({ file }) {
//   const [videoDuration, setVideoDuration] = useState(0);
//   const [endTime, setEndTime] = useState(0);
//   const [startTime, setStartTime] = useState(0);
//   const [videoSrc, setVideoSrc] = useState("");
//   const [videoFileValue, setVideoFileValue] = useState(null);
//   const [isScriptLoaded, setIsScriptLoaded] = useState(false);
//   const [videoTrimmedUrl, setVideoTrimmedUrl] = useState("");
//   const [isMute, setIsMute] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const videoRef = useRef();
//   let initialSliderValue = 0;

//   useEffect(() => {
//     const ffmpeg = createFFmpeg();

//     const loadFFmpeg = async () => {
//       if (!ffmpeg.isLoaded()) {
//         await ffmpeg.load();
//         setIsScriptLoaded(true);
//       }
//     };

//     loadFFmpeg();

//     if (typeof window !== "undefined") {
//       window.ffmpeg = ffmpeg;
//     }
//   }, []);

//   useEffect(() => {
//     const blobURL = URL.createObjectURL(file);
//     setVideoFileValue(file);
//     setVideoSrc(blobURL);
//   }, [file]);

//   const convertToHHMMSS = (val) => {
//     const secNum = parseInt(val, 10);
//     let hours = Math.floor(secNum / 3600);
//     let minutes = Math.floor((secNum - hours * 3600) / 60);
//     let seconds = secNum - hours * 3600 - minutes * 60;

//     hours = hours.toString().padStart(2, "0");
//     minutes = minutes.toString().padStart(2, "0");
//     seconds = seconds.toString().padStart(2, "0");

//     return `${hours}:${minutes}:${seconds}`;
//   };

//   useEffect(() => {
//     if (videoRef.current) {
//       const currentVideo = videoRef.current;
//       currentVideo.onloadedmetadata = () => {
//         setVideoDuration(currentVideo.duration);
//         setEndTime(currentVideo.duration);
//       };
//     }
//   }, [videoSrc]);

//   const updateOnSliderChange = (values, handle) => {
//     setVideoTrimmedUrl("");
//     let readValue = values[handle];
//     if (handle) {
//       if (endTime !== readValue) {
//         setEndTime(readValue);
//       }
//     } else {
//       if (initialSliderValue !== readValue) {
//         initialSliderValue = readValue;
//         if (videoRef.current) {
//           videoRef.current.currentTime = readValue;
//           setStartTime(readValue);
//         }
//       }
//     }
//   };

//   const handlePlay = (e) => {
//     e.preventDefault();
//     setIsPlaying(!isPlaying);
//   };

//   const handlePauseVideo = (e) => {
//     e.preventDefault();
//     const currentTime = Math.floor(e.currentTarget.currentTime);
//     if (currentTime === endTime) {
//       e.currentTarget.pause();
//     }
//   };

//   const handleTrim = async (e) => {
//     e.preventDefault();
//     if (isScriptLoaded) {
//       const { name, type } = videoFileValue;
//       window.ffmpeg.FS(
//         "writeFile",
//         name,
//         await fetch(videoFileValue.url).then((res) => res.arrayBuffer())
//       );
//       const videoFileType = type.split("/")[1];
//       await window.ffmpeg.run(
//         "-i",
//         name,
//         "-ss",
//         convertToHHMMSS(startTime),
//         "-to",
//         convertToHHMMSS(endTime),
//         "-acodec",
//         "copy",
//         "-vcodec",
//         "copy",
//         `out.${videoFileType}`
//       );
//       const data = window.ffmpeg.FS("readFile", `out.${videoFileType}`);
//       const url = URL.createObjectURL(
//         new Blob([data.buffer], { type: videoFileValue.type })
//       );
//       setVideoTrimmedUrl(url);
//       console.log("video got trimmed.");
//     } else {
//       console.log("video not trimmed.");
//     }
//   };

//   const toggleMute = () => {
//     setIsMute(!isMute);
//   };

//   return (
//     <div className="App">
//       <div>
//         <Head>
//           <script
//             type="module"
//             src="https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/+esm"
//           ></script>
//         </Head>
//       </div>
//       <br />
//       {videoSrc.length ? (
//         <React.Fragment>
//           <div className="relative h-100 w-100 bg-dark-3">
//             <div
//               className="h-[100%] w-[100%] absolute cursor-pointer flex items-center justify-center z-10"
//               onClick={handlePlay}
//             >
//               {isPlaying ? (
//                 <div className="opacity-20">
//                   <FaCirclePause style={{ fontSize: "48px" }} color="#fff" />
//                 </div>
//               ) : (
//                 <div>
//                   <FaCirclePlay style={{ fontSize: "48px" }} color="#fff" />
//                 </div>
//               )}
//             </div>
//             <div
//               className="absolute bottom-4 right-6 cursor-pointer flex items-center justify-center z-10"
//               onClick={toggleMute}
//             >
//               {isMute ? (
//                 <div className="opacity-20">
//                   <FaVolumeMute style={{ fontSize: "24px" }} color="#fff" />
//                 </div>
//               ) : (
//                 <div>
//                   <FaVolumeUp style={{ fontSize: "24px" }} color="#fff" />
//                 </div>
//               )}
//             </div>
//             <video
//               src={videoSrc}
//               ref={videoRef}
//               height={
//                 typeof window !== "undefined" && window.innerWidth < 992
//                   ? 400
//                   : 600
//               }
//               width="100%"
//               muted={isMute}
//               onPlay={() => setIsPlaying(true)}
//               onPause={() => setIsPlaying(false)}
//               onTimeUpdate={handlePauseVideo}
//             >
//               <source
//                 src={videoTrimmedUrl ? videoTrimmedUrl : videoSrc}
//                 type={videoFileValue.type}
//               />
//             </video>
//           </div>
//           <br />
//           <Nouislider
//             behaviour="tap-drag"
//             step={1}
//             margin={3}
//             limit={30}
//             range={{ min: 0, max: videoDuration || 2 }}
//             start={[0, videoDuration || 2]}
//             connect
//             onUpdate={updateOnSliderChange}
//           />
//           <br />
//           Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration:{" "}
//           {convertToHHMMSS(endTime)}
//           <br />
//           <button onClick={handlePlay}>Play</button> &nbsp;
//           <button onClick={handleTrim}>Trim</button>
//           <br />
//           {videoTrimmedUrl && (
//             <video controls>
//               <source src={videoTrimmedUrl} type={videoFileValue.type} />
//             </video>
//           )}
//           <div>
//             <ReactVideoTrimmer timeRange={20} />
//           </div>
//         </React.Fragment>
//       ) : (
//         ""
//       )}
//     </div>
//   );
// }
