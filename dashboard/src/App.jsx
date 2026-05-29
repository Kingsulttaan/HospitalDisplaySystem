import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Hospitals from "./pages/Hospitals";
import Monitoring from "./pages/Monitoring";
import UploadMedia from "./pages/UploadMedia";
import Player from "./pages/Player";
import Playlist from "./pages/Playlist";
import Schedules from "./pages/Schedules";
import Emergency from "./pages/Emergency";
import Users from "./pages/Users";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/hospitals"
          element={<Hospitals />}
        />

        <Route
          path="/monitoring"
          element={<Monitoring />}
        />

        <Route
          path="/upload"
          element={<UploadMedia />}
        />

        <Route
          path="/playlist"
          element={<Playlist />}
        />

        <Route
          path="/schedules"
          element={<Schedules />}
        />

        <Route
          path="/emergency"
          element={<Emergency />}
        />

        <Route
          path="/users"
          element={<Users />}
        />

        <Route
          path="/player/:deviceId"
          element={<Player />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;