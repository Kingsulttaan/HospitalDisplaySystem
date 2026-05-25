import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Playlist() {

  const [deviceId, setDeviceId] =
    useState("");

  const [playlist, setPlaylist] =
    useState([]);

  const loadPlaylist =
    async () => {

      if (
        deviceId.trim() === ""
      )
        return;

      try {

        const response =
          await axios.get(
            `http://localhost:5000/playlist/${deviceId}`
          );

        setPlaylist(
          response.data
        );

      } catch {

        alert(
          "Hospital not found"
        );

      }

    };

  const deleteItem =
    async (itemId) => {

      await axios.delete(
        `http://localhost:5000/playlist/${deviceId}/${itemId}`
      );

      loadPlaylist();

    };

  const moveUp =
    async (itemId) => {

      await axios.put(
        `http://localhost:5000/playlist/${deviceId}/${itemId}/up`
      );

      loadPlaylist();

    };

  const moveDown =
    async (itemId) => {

      await axios.put(
        `http://localhost:5000/playlist/${deviceId}/${itemId}/down`
      );

      loadPlaylist();

    };

  useEffect(() => {

    if (
      deviceId !== ""
    ) {

      loadPlaylist();

    }

  }, [deviceId]);

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-4xl font-bold mb-8">

          Playlist Manager

        </h1>

        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <input
            type="text"
            placeholder="PI001"
            value={deviceId}
            onChange={(e) =>
              setDeviceId(
                e.target.value
              )
            }
            className="
            border
            p-3
            rounded-xl
            w-full
            "
          />

          <button
            onClick={
              loadPlaylist
            }
            className="
            mt-4
            bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            "
          >

            Load Playlist

          </button>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-bold mb-4">

            Total Items:
            {" "}
            {playlist.length}

          </h2>

          {

            playlist.length === 0 && (

              <p>

                No media found

              </p>

            )

          }

          {

            playlist.map(
              item => (

                <div
                  key={item._id}
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
                        item.filename
                      }

                    </strong>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        moveUp(
                          item._id
                        )
                      }
                      className="
                      bg-green-600
                      text-white
                      px-3
                      py-2
                      rounded
                      "
                    >
                      ▲
                    </button>

                    <button
                      onClick={() =>
                        moveDown(
                          item._id
                        )
                      }
                      className="
                      bg-blue-600
                      text-white
                      px-3
                      py-2
                      rounded
                      "
                    >
                      ▼
                    </button>

                    <button
                      onClick={() =>
                        deleteItem(
                          item._id
                        )
                      }
                      className="
                      bg-red-600
                      text-white
                      px-3
                      py-2
                      rounded
                      "
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )

          }

        </div>

      </div>

    </div>

  );

}

export default Playlist;