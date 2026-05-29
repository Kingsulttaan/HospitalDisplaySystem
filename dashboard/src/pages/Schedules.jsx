import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Schedules() {

  const [deviceId, setDeviceId] =
    useState("");

  const [filename, setFilename] =
    useState("");

  const [mediaUrl, setMediaUrl] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [schedules, setSchedules] =
    useState([]);

  const loadSchedules =
    async () => {

      if (
        deviceId.trim() === ""
      )
        return;

      try {

        const response =
          await axios.get(
            `http://localhost:5000/schedule/${deviceId}`
          );

        setSchedules(
          response.data
        );

      } catch {

        alert(
          "Hospital not found"
        );

      }

    };

  const saveSchedule =
    async () => {

      if (

        deviceId === "" ||

        filename === "" ||

        startTime === "" ||

        endTime === ""

      ) {

        alert(
          "Fill all fields"
        );

        return;

      }

      try {

        await axios.post(
          "http://localhost:5000/schedule",
          {

            deviceId,

            filename,

            mediaUrl,

            startTime,

            endTime

          }
        );

        alert(
          "Schedule Saved"
        );

        setFilename("");
        setMediaUrl("");
        setStartTime("");
        setEndTime("");

        loadSchedules();

      } catch (error) {

        console.log(error);

      }

    };

  const deleteSchedule =
    async (scheduleId) => {

      await axios.delete(
        `http://localhost:5000/schedule/${deviceId}/${scheduleId}`
      );

      loadSchedules();

    };

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-4xl font-bold mb-8">

          Schedule Manager

        </h1>

        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="PI002"
              value={deviceId}
              onChange={(e) =>
                setDeviceId(
                  e.target.value
                )
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="Filename"
              value={filename}
              onChange={(e) =>
                setFilename(
                  e.target.value
                )
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="text"
              placeholder="Media URL"
              value={mediaUrl}
              onChange={(e) =>
                setMediaUrl(
                  e.target.value
                )
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="time"
              value={startTime}
              onChange={(e) =>
                setStartTime(
                  e.target.value
                )
              }
              className="border p-3 rounded-xl"
            />

            <input
              type="time"
              value={endTime}
              onChange={(e) =>
                setEndTime(
                  e.target.value
                )
              }
              className="border p-3 rounded-xl"
            />

          </div>

          <div className="flex gap-3 mt-4">

            <button
              onClick={
                saveSchedule
              }
              className="
              bg-blue-700
              text-white
              px-6
              py-3
              rounded-xl
              "
            >

              Save Schedule

            </button>

            <button
              onClick={
                loadSchedules
              }
              className="
              bg-green-700
              text-white
              px-6
              py-3
              rounded-xl
              "
            >

              Load Schedules

            </button>

          </div>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-bold mb-4">

            Current Schedules

          </h2>

          {

            schedules.length === 0 && (

              <p>

                No schedules found

              </p>

            )

          }

          {

            schedules.map(
              schedule => (

                <div
                  key={schedule._id}
                  className="
                  border
                  p-4
                  rounded-xl
                  mb-3
                  flex
                  justify-between
                  items-center
                  "
                >

                  <div>

                    <strong>

                      {
                        schedule.filename
                      }

                    </strong>

                    <br />

                    {
                      schedule.startTime
                    }

                    {" - "}

                    {
                      schedule.endTime
                    }

                  </div>

                  <button
                    onClick={() =>
                      deleteSchedule(
                        schedule._id
                      )
                    }
                    className="
                    bg-red-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    "
                  >

                    Delete

                  </button>

                </div>

              )
            )

          }

        </div>

      </div>

    </div>

  );

}

export default Schedules;