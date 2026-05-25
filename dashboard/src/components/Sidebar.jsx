import {
  FaHospital,
  FaWifi,
  FaUpload,
  FaChartBar
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Sidebar() {

  return (

    <div className="w-64 bg-blue-900 text-white min-h-screen p-6">

      <h1 className="text-3xl font-bold mb-10">
        Hospital CMS
      </h1>

      <div className="space-y-5">

        <Link
          to="/dashboard"
          className="flex items-center gap-3 hover:text-yellow-300"
        >
          <FaChartBar />
          Dashboard
        </Link>

        <Link
          to="/hospitals"
          className="flex items-center gap-3 hover:text-yellow-300"
        >
          <FaHospital />
          Hospitals
        </Link>

        <Link
          to="/monitoring"
          className="flex items-center gap-3 hover:text-yellow-300"
        >
          <FaWifi />
          Monitoring
        </Link>

        <Link
          to="/upload"
          className="flex items-center gap-3 hover:text-yellow-300"
        >
          <FaUpload />
          Upload Media
        </Link>

      </div>

    </div>

  );
}

export default Sidebar;