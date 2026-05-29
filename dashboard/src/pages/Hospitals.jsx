import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Hospitals() {

  const [hospitalName, setHospitalName] =
    useState("");

  const [deviceId, setDeviceId] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [hospitals, setHospitals] =
    useState([]);

  const loadHospitals = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5000/hospitals"
        );

      setHospitals(
        response.data
      );

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    loadHospitals();

  }, []);

  const saveHospital = async () => {

    if (
      hospitalName.trim() === "" ||
      deviceId.trim() === ""
    ) {

      alert(
        "Please fill all fields"
      );

      return;

    }

    try {

      if (
        editingId === null
      ) {

        await axios.post(
          "http://localhost:5000/hospital",
          {
            name:
              hospitalName,
            deviceId
          }
        );

        alert(
          "Hospital added successfully"
        );

      } else {

        await axios.put(
          `http://localhost:5000/hospital/${editingId}`,
          {
            name:
              hospitalName,
            deviceId
          }
        );

        alert(
          "Hospital updated successfully"
        );

      }

      setHospitalName("");
      setDeviceId("");
      setEditingId(null);

      loadHospitals();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Operation failed"
      );

    }

  };

  const editHospital =
    (hospital) => {

      setHospitalName(
        hospital.name
      );

      setDeviceId(
        hospital.deviceId
      );

      setEditingId(
  hospital._id
);

      window.scrollTo({
        top: 0,
        behavior:
          "smooth"
      });

    };

  const cancelEdit =
    () => {

      setHospitalName("");
      setDeviceId("");
      setEditingId(null);

    };

  const deleteHospital =
    async (id) => {

      const confirmed =
        window.confirm(
          "Delete this hospital?"
        );

      if (!confirmed)
        return;

      try {

        await axios.delete(
          `http://localhost:5000/hospital/${id}`
        );

        loadHospitals();

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">

            Hospitals

          </h1>

          <div
            className="
            bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            font-bold
            "
          >

            Total:
            {" "}
            {hospitals.length}

          </div>

        </div>

        <div
          className="
          bg-white
          p-6
          rounded-2xl
          shadow
          mb-8
          "
        >

          <h2 className="text-2xl font-bold mb-4">

            {
              editingId === null
                ? "Add Hospital"
                : "Edit Hospital"
            }

          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Hospital Name"
              value={hospitalName}
              onChange={(e) =>
                setHospitalName(
                  e.target.value
                )
              }
              className="
              border
              p-3
              rounded-xl
              "
            />

            <input
              type="text"
              placeholder="Device ID"
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
              "
            />

          </div>

          <div className="mt-4 flex gap-3">

            <button
              onClick={
                saveHospital
              }
              className="
              bg-blue-700
              text-white
              px-6
              py-3
              rounded-xl
              hover:bg-blue-800
              "
            >

              {
                editingId === null
                  ? "Save Hospital"
                  : "Save Changes"
              }

            </button>

            {
              editingId !== null && (

                <button
                  onClick={
                    cancelEdit
                  }
                  className="
                  bg-gray-500
                  text-white
                  px-6
                  py-3
                  rounded-xl
                  "
                >

                  Cancel

                </button>

              )
            }

          </div>

        </div>

        <h2 className="text-2xl font-bold mb-4">

          Registered Hospitals

        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          {
            hospitals.map(
              hospital => (

                <div
                  key={
  hospital._id
}
                  className="
                  bg-white
                  p-5
                  rounded-2xl
                  shadow
                  border
                  "
                >

                  <div className="flex justify-between">

                    <h3 className="text-xl font-bold">

                      {
                        hospital.name
                      }

                    </h3>

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          editHospital(
                            hospital
                          )
                        }
                        className="
                        bg-yellow-500
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        "
                      >

                        Edit

                      </button>

                      <button
                        onClick={() =>
                          deleteHospital(
  hospital._id
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

                  </div>

                  <p className="mt-3">

                    <strong>
                      Device ID:
                    </strong>

                    {" "}
                    {
                      hospital.deviceId
                    }

                  </p>

                  <p className="mt-2">

                    <strong>
                      Status:
                    </strong>

                    {" "}

                    <span
                      className={
                        hospital.status ===
                        "Online"
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >

                      {
                        hospital.status
                      }

                    </span>

                  </p>

                  <p className="mt-2">

                    <strong>
                      Current Content:
                    </strong>

                    {" "}

                    {
                      hospital.currentContent
                    }

                  </p>

                </div>

              )
            )
          }

        </div>

      </div>

    </div>

  );

}

export default Hospitals;