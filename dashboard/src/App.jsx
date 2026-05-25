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
          path="/player/:deviceId"
          element={<Player />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;