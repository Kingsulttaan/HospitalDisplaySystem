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

  const [scheduleMedia, setScheduleMedia] =
    useState(null);

  const [emergency, setEmergency] =
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

      } catch (error) {

        console.log(error);

      }

    };

  const checkSchedules =
    async () => {

      try {

        const response =
          await axios.get(
            `http://localhost:5000/schedule/${deviceId}`
          );

        const schedules =
          response.data;

        const now =
          new Date();

        const currentTime =
          now
            .toTimeString()
            .slice(0, 5);

        const active =
          schedules.find(
            item =>

              currentTime >=
              item.startTime &&

              currentTime <=
              item.endTime
          );

        if (active) {

          setScheduleMedia(
            active
          );

        } else {

          setScheduleMedia(
            null
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  const loadEmergency =
    async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/emergency"
          );

        if (
          response.data.active
        ) {

          setEmergency(
            response.data
          );

        } else {

          setEmergency(
            null
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    if (!deviceId)
      return;

    loadPlaylist();

    checkSchedules();

    loadEmergency();

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

    const refreshTimer =
      setInterval(() => {

        checkSchedules();

        loadEmergency();

      }, 5000);

    socket.on(
      "playlist-updated",
      async () => {

        await loadPlaylist();

        await checkSchedules();

      }
    );

    socket.on(
      "emergency-updated",
      async () => {

        await loadEmergency();

      }
    );

    return () => {

      clearInterval(
        heartbeat
      );

      clearInterval(
        refreshTimer
      );

      socket.off(
        "playlist-updated"
      );

      socket.off(
        "emergency-updated"
      );

    };

  }, [deviceId]);

  useEffect(() => {

    if (
      emergency
    ) {

      setCurrentMedia({

        mediaUrl:
          emergency.mediaUrl

      });

      return;

    }

    if (
      scheduleMedia
    ) {

      setCurrentMedia(
        scheduleMedia
      );

      return;

    }

    if (
      playlist.length === 0
    )
      return;

    const media =
      playlist[
        currentIndex
      ];

    setCurrentMedia(
      media
    );

    const isVideo =
      media.mediaUrl
        .toLowerCase()
        .endsWith(".mp4");

    if (isVideo)
      return;

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
    playlist,
    scheduleMedia,
    emergency
  ]);

  const nextMedia =
    () => {

      if (
        emergency
      )
        return;

      if (
        scheduleMedia
      )
        return;

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

      <div className="h-screen bg-black flex items-center justify-center">

        <h1 className="text-white text-4xl">

          Waiting for content...

        </h1>

      </div>

    );

  }

  const isVideo =
    currentMedia.mediaUrl
      .toLowerCase()
      .endsWith(".mp4");

  return (

  <div className="h-screen bg-black relative">

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
          loop={
            emergency ||
            scheduleMedia
              ? true
              : false
          }
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

    {

      emergency && (

        <div
          className="
          absolute
          top-0
          left-0
          w-full
          bg-red-700
          text-white
          text-center
          text-5xl
          font-bold
          py-6
          z-50
          "
        >

          🚨 {emergency.message}

        </div>

      )

    }

  </div>

);

}

export default Player;