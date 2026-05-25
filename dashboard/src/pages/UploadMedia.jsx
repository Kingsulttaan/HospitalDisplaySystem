import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function UploadMedia() {

  const [file, setFile] =
    useState(null);

  const [hospitals, setHospitals] =
    useState([]);

  const [selectedDevice, setSelectedDevice] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  useEffect(() => {

    loadHospitals();

  }, []);

  const loadHospitals = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5000/hospitals"
        );

      setHospitals(
        response.data
      );

      if (
        response.data.length > 0
      ) {

        setSelectedDevice(
          response.data[0].deviceId
        );

      }

    } catch (error) {

      console.log(error);

    }

  };

  const uploadMedia = async () => {

    if (!file) {

      alert(
        "Please select a file"
      );

      return;

    }

    setUploading(true);

    const formData =
      new FormData();

    formData.append(
      "media",
      file
    );

    formData.append(
      "deviceId",
      selectedDevice
    );

    try {

      await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      alert(
        "Media uploaded successfully"
      );

      setFile(null);

    } catch (error) {

      console.log(error);

      alert(
        "Upload failed"
      );

    }

    setUploading(false);

  };

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-4xl font-bold mb-8">

          Upload Media

        </h1>

        <div className="bg-white p-8 rounded-2xl shadow">

          <div className="mb-6">

            <label className="block mb-2 font-bold">

              Select Hospital

            </label>

            <select
              value={selectedDevice}
              onChange={(e) =>
                setSelectedDevice(
                  e.target.value
                )
              }
              className="border p-3 rounded-xl w-full"
            >

              {hospitals.map(
                hospital => (

                  <option
                    key={hospital.id}
                    value={
                      hospital.deviceId
                    }
                  >

                    {hospital.name}
                    {" - "}
                    {
                      hospital.deviceId
                    }

                  </option>

                )
              )}

            </select>

          </div>

          <div className="mb-6">

            <label className="block mb-2 font-bold">

              Choose Image or Video

            </label>

            <input
              type="file"
              onChange={(e) =>
                setFile(
                  e.target.files[0]
                )
              }
            />

          </div>

          {file && (

            <div className="mb-6">

              <strong>
                Selected:
              </strong>

              {" "}

              {file.name}

            </div>

          )}

          <button
            onClick={uploadMedia}
            disabled={uploading}
            className="
            bg-blue-700
            text-white
            px-8
            py-3
            rounded-xl
            hover:bg-blue-800
            "
          >

            {uploading
              ? "Uploading..."
              : "Upload"}

          </button>

        </div>

      </div>

    </div>

  );

}

export default UploadMedia;