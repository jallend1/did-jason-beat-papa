import { useState, useEffect } from 'react';

import VictoryVideo from '../assets/videos/win.mp4';
import DefeatVideo from '../assets/videos/defeat.mp4';
import LoadingVideo from '../assets/videos/loading.mp4';
import NotYetVideo from '../assets/videos/notyet.mp4';
import DrawVideo from '../assets/videos/draw.mp4';
import loadingScreenshot from '../assets/images/screenshot-loading.png';
import notYetScreenshot from '../assets/images/screenshot-not-yet.png';
import victoryScreenshot from '../assets/images/screenshot-win.jpg';
import defeatScreenshot from '../assets/images/screenshot-defeat.png';
import drawScreenshot from '../assets/images/screenshot-draw.png';
import errorScreenshot from '../assets/images/screenshot-error.jpg';

const backgroundVideos = {
  win: { video: VictoryVideo, screenshot: victoryScreenshot },
  loss: { video: DefeatVideo, screenshot: defeatScreenshot },
  pending: { video: NotYetVideo, screenshot: notYetScreenshot },
  loading: { video: LoadingVideo, screenshot: loadingScreenshot },
  draw: { video: DrawVideo, screenshot: drawScreenshot },
  error: { screenshot: errorScreenshot }
};

const BackgroundVideo = ({ gameResults }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const onLoadedData = () => {
    setIsVideoLoaded(true);
  };

  useEffect(() => {
    setIsVideoLoaded(false);
    new Image().src = backgroundVideos[gameResults].screenshot;
    // TODO: Abort loading of video if it's not needed
    // return () => {
    //   if (gameResults !== 'loading') {
    //     console.log('Unmounting');
    //     const el = document.getElementById('background-video');
    //     if (el && el.src.includes('loading')) {
    //       el.setAttribute('src', '');
    //     }
    //   }
    // };
  }, [gameResults]);

  return (
    <div className="background-video" key={gameResults}>
      <img
        src={backgroundVideos[gameResults].screenshot}
        alt="Results screenshot"
        style={{ opacity: isVideoLoaded ? 0 : 1 }}
        className={gameResults === 'pending' ? 'pending-video' : null}
      />
      {gameResults !== 'error' && (
        <video
          id="background-video"
          autoPlay
          muted
          loop
          className={gameResults === 'pending' ? 'pending-video' : null}
          src={backgroundVideos[gameResults].video}
          type="video/mp4"
          onLoadedData={onLoadedData}
          style={{ opacity: isVideoLoaded ? 1 : 0 }}
          preload="auto"
        />
      )}
    </div>
  );
};

export default BackgroundVideo;
