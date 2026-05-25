import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Monitoring() {

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

    const interval =
      setInterval(
        loadHospitals,
        3000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-4xl font-bold mb-8">

          Live Monitoring

        </h1>

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-700 text-white">

              <tr>

                <th className="p-4 text-left">
                  Hospital
                </th>

                <th className="p-4 text-left">
                  Device ID
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Current Content
                </th>

              </tr>

            </thead>

            <tbody>

              {hospitals.map(
                hospital => (

                  <tr
                    key={hospital.id}
                    className="border-b"
                  >

                    <td className="p-4">

                      {hospital.name}

                    </td>

                    <td className="p-4">

                      {hospital.deviceId}

                    </td>

                    <td className="p-4">

                      <span
                        className={
                          hospital.status ===
                          "Online"
                            ? "text-green-600 font-bold"
                            : "text-red-600 font-bold"
                        }
                      >

                        {hospital.status}

                      </span>

                    </td>

                    <td className="p-4">

                      {
                        hospital.currentContent
                      }

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default Monitoring;