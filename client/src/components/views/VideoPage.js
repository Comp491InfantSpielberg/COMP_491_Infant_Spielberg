import React from "react";
import { useParams } from "react-router-dom";

const VideoPage = () => {
  const { videoUrl } = useParams();

  return (
    <div>
      <h2>Generated Video</h2>
      <video controls>
        <source src={videoUrl} type="video/mp4" />
         Browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPage;
