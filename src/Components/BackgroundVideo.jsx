import { useRef, useState } from "react";

import VictoryVideo from "../assets/videos/win.mp4";
import DefeatVideo from "../assets/videos/defeat.mp4";
import LoadingVideo from "../assets/videos/loading.mp4";
import NotYetVideo from "../assets/videos/notyet.mp4";
import DrawVideo from "../assets/videos/draw.mp4";

import loadingScreenshot from "../assets/images/screenshot-loading.jpg";

const BackgroundVideo = ({ gameResults, isReadyToLoadVideo }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const backgroundVideos = {
    win: VictoryVideo,
    loss: DefeatVideo,
    pending: NotYetVideo,
    loading: LoadingVideo,
    draw: DrawVideo,
  };

  const onLoadedData = () => {
    setIsVideoLoaded(true);
  };

  const videoRef = useRef(null);

  if (isReadyToLoadVideo) {
    return (
      <div className="background-video" key={gameResults}>
        <video
          autoPlay
          muted
          loop
          className={gameResults === "pending" ? "pending-video" : null}
          src={backgroundVideos[gameResults]}
          type="video/mp4"
          ref={videoRef}
        />
      </div>
    );
  } else {
    return (
      <div className="background-video">
        <img
          src={loadingScreenshot}
          alt="loading screenshot"
          style={{ opacity: isVideoLoaded ? 0 : 1 }}
          className="background"
        />
        <video
          autoPlay
          muted
          loop
          src={backgroundVideos.loading}
          type="video/mp4"
          onLoadedData={onLoadedData}
          style={{ opacity: isVideoLoaded ? 1 : 0 }}
        />
      </div>
    );
  }
};

export default BackgroundVideo;
