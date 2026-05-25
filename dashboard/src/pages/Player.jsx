import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";

const socket =
  io("http://localhost:5000");

function Player() {

  const { deviceId } =
    useParams();

  const [playlist, setPlaylist] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [currentMedia, setCurrentMedia] =
    useState(null);

  const loadPlaylist =
    async () => {

      try {

        const response =
          await axios.get(
            `http://localhost:5000/playlist/${deviceId}`
          );

        setPlaylist(
          response.data
        );

        if (
          response.data.length > 0
        ) {

          setCurrentMedia(
            response.data[0]
          );

          setCurrentIndex(0);

        }

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    if (!deviceId)
      return;

    loadPlaylist();

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
      async () => {

        await loadPlaylist();

      }
    );

    return () => {

      clearInterval(
        heartbeat
      );

    };

  }, [deviceId]);

  useEffect(() => {

    if (
      playlist.length === 0
    ) return;

    const media =
      playlist[
        currentIndex
      ];

    setCurrentMedia(
      media
    );

    if (
      media.mediaUrl
        .toLowerCase()
        .endsWith(".mp4")
    ) {

      return;

    }

    const timer =
      setTimeout(() => {

        setCurrentIndex(
          previous =>
            (previous + 1) %
            playlist.length
        );

      }, 10000);

    return () =>
      clearTimeout(timer);

  }, [
    currentIndex,
    playlist
  ]);

  const nextMedia =
    () => {

      setCurrentIndex(
        previous =>
          (previous + 1) %
          playlist.length
      );

    };

  if (
    !currentMedia
  ) {

    return (

      <div className="h-screen bg-black flex flex-col items-center justify-center">

        <h1 className="text-white text-4xl mb-4">

          Waiting for content...

        </h1>

        <p className="text-green-400">

          Device:
          {" "}
          {deviceId}

        </p>

      </div>

    );

  }

  const isVideo =
    currentMedia.mediaUrl
      .toLowerCase()
      .endsWith(".mp4");

  return (

    <div className="h-screen bg-black">

      {

        !isVideo && (

          <img
            src={
              currentMedia.mediaUrl
            }
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

        isVideo && (

          <video
            src={
              currentMedia.mediaUrl
            }
            autoPlay
            muted
            onEnded={
              nextMedia
            }
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