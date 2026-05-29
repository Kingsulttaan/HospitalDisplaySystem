import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Emergency() {

  const [message, setMessage] =
    useState("");

  const [mediaUrl, setMediaUrl] =
    useState("");

  const [active, setActive] =
    useState(false);

  const loadEmergency =
    async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/emergency"
          );

        setMessage(
          response.data.message
        );

        setMediaUrl(
          response.data.mediaUrl
        );

        setActive(
          response.data.active
        );

      } catch (error) {

        console.log(error);

      }

    };

  const saveEmergency =
    async (status) => {

      try {

        await axios.post(
          "http://localhost:5000/emergency",
          {

            active: status,

            message,

            mediaUrl

          }
        );

        setActive(status);

        alert(
          status
            ? "Emergency Activated"
            : "Emergency Deactivated"
        );

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    loadEmergency();

  }, []);

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-4xl font-bold mb-8">

          Emergency Broadcast

        </h1>

        <div className="bg-white p-6 rounded-2xl shadow">

          <input
            type="text"
            placeholder="Emergency Message"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            className="
            border
            p-3
            rounded-xl
            w-full
            mb-4
            "
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
            className="
            border
            p-3
            rounded-xl
            w-full
            mb-4
            "
          />

          <div className="flex gap-3">

            <button
              onClick={() =>
                saveEmergency(
                  true
                )
              }
              className="
              bg-red-600
              text-white
              px-6
              py-3
              rounded-xl
              "
            >

              Activate

            </button>

            <button
              onClick={() =>
                saveEmergency(
                  false
                )
              }
              className="
              bg-green-600
              text-white
              px-6
              py-3
              rounded-xl
              "
            >

              Deactivate

            </button>

          </div>

          <div className="mt-6">

            Status:

            <span
              className={
                active
                  ? "text-red-600 font-bold ml-2"
                  : "text-green-600 font-bold ml-2"
              }
            >

              {active
                ? "ACTIVE"
                : "INACTIVE"}

            </span>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Emergency;