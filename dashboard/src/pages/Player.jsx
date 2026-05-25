import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket =
  io("http://localhost:5000");

function Player() {

  const { deviceId } =
    useParams();

  const [mediaUrl, setMediaUrl] =
    useState("");

  useEffect(() => {

    if (!deviceId)
      return;

    socket.emit(
      "register-device",
      deviceId
    );

    const heartbeat =
      setInterval(() => {

        socket.emit(
          "heartbeat",
          deviceId
        );

      }, 3000);

    socket.on(
      "new-media",
      (data) => {

        setMediaUrl(
          data.mediaUrl
        );

      }
    );

    return () => {

      clearInterval(
        heartbeat
      );

    };

  }, [deviceId]);

  const isVideo =
    mediaUrl.endsWith(
      ".mp4"
    );

  return (

    <div className="h-screen bg-black flex items-center justify-center">

      {!mediaUrl && (

        <div className="text-center">

          <h1 className="text-white text-4xl mb-4">

            Waiting for content...

          </h1>

          <p className="text-green-400">

            Device:
            {" "}
            {deviceId}

          </p>

        </div>

      )}

      {
        mediaUrl &&
        !isVideo && (

          <img
            src={mediaUrl}
            alt=""
            className="
            w-full
            h-full
            object-contain
            "
          />

        )
      }

      {
        mediaUrl &&
        isVideo && (

          <video
            src={mediaUrl}
            autoPlay
            controls
            className="
            w-full
            h-full
            "
          />

        )
      }

    </div>

  );

}

export default Player;