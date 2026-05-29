import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function Users() {

  const [users, setUsers] =
    useState([]);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("Operator");

  const loadUsers =
    async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/users"
          );

        setUsers(
          response.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  const createUser =
    async () => {

      try {

        await axios.post(
          "http://localhost:5000/users",
          {

            username,

            password,

            role

          }
        );

        setUsername("");

        setPassword("");

        setRole(
          "Operator"
        );

        loadUsers();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Error creating user"
        );

      }

    };

  const deleteUser =
    async (id) => {

      const confirmed =
        window.confirm(
          "Delete this user?"
        );

      if (!confirmed)
        return;

      try {

        await axios.delete(
          `http://localhost:5000/users/${id}`
        );

        loadUsers();

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    loadUsers();

  }, []);

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        <h1 className="text-4xl font-bold mb-8">

          User Management

        </h1>

        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold mb-4">

            Add User

          </h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
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

          <select
            value={role}
            onChange={(e) =>
              setRole(
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
          >

            <option>
              Super Admin
            </option>

            <option>
              Admin
            </option>

            <option>
              Operator
            </option>

            <option>
              Viewer
            </option>

          </select>

          <button
            onClick={createUser}
            className="
            bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            "
          >

            Create User

          </button>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-bold mb-4">

            Existing Users

          </h2>

          {

            users.map(
              user => (

                <div
                  key={user._id}
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

                      {user.username}

                    </strong>

                    <br />

                    {user.role}

                  </div>

                  <button
                    onClick={() =>
                      deleteUser(
                        user._id
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

export default Users;