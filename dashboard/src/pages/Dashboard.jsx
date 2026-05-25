import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Dashboard() {

  const [hospitals, setHospitals] =
    useState([]);

  const loadHospitals = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5000/hospitals"
        );

      setHospitals(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    loadHospitals();

  }, []);

  const totalHospitals =
    hospitals.length;

  const onlineDevices =
    hospitals.filter(
      h => h.status === "Online"
    ).length;

  const offlineDevices =
    hospitals.filter(
      h => h.status !== "Online"
    ).length;

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-green-500 text-white p-6 rounded-2xl shadow-lg">

            <h2 className="text-xl">
              Online Devices
            </h2>

            <p className="text-5xl font-bold mt-4">
              {onlineDevices}
            </p>

          </div>

          <div className="bg-red-500 text-white p-6 rounded-2xl shadow-lg">

            <h2 className="text-xl">
              Offline Devices
            </h2>

            <p className="text-5xl font-bold mt-4">
              {offlineDevices}
            </p>

          </div>

          <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-lg">

            <h2 className="text-xl">
              Total Hospitals
            </h2>

            <p className="text-5xl font-bold mt-4">
              {totalHospitals}
            </p>

          </div>

        </div>

        <div className="mt-10 bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold mb-4">
            Registered Hospitals
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Hospital
                </th>

                <th className="text-left py-3">
                  Device ID
                </th>

                <th className="text-left py-3">
                  Status
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

                    <td className="py-3">
                      {hospital.name}
                    </td>

                    <td className="py-3">
                      {hospital.deviceId}
                    </td>

                    <td className="py-3">

                      <span className="text-red-500">

                        {hospital.status}

                      </span>

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

export default Dashboard;