import { useRef } from 'react';

import VictoryVideo from '../images/win.mp4';
import DefeatVideo from '../images/defeat.mp4';
import LoadingVideo from '../images/loading.mp4';
import NotYetVideo from '../images/notyet.mp4';
import DrawVideo from '../images/draw.mp4';

const BackgroundVideo = ({ gameResults, isReadyToLoadVideo }) => {
  const backgroundVideos = {
    win: VictoryVideo,
    loss: DefeatVideo,
    pending: NotYetVideo,
    loading: LoadingVideo,
    draw: DrawVideo
  };

  const videoRef = useRef(null);

  // Download the video file if it is not already downloaded
  const downloadVideo = () => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  if (isReadyToLoadVideo) {
    return (
      <div className="background-video" key={gameResults}>
        <video
          autoPlay
          muted
          loop
          className={gameResults === 'pending' ? 'pending-video' : null}
          src={backgroundVideos[gameResults]}
          type="video/mp4"
          ref={videoRef}
        />
      </div>
    );
  } else {
    return (
      <div className="background-video">
        <video
          autoPlay
          muted
          loop
          src={backgroundVideos.loading}
          type="video/mp4"
        />
      </div>
    );
  }
};

export default BackgroundVideo;
