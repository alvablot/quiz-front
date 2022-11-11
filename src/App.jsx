import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Voter from "./pages/Voter";
import Admin from "./pages/Admin";

import "./App.css";

function Root() {
  return (
      <div>
          <Outlet />
      </div>
  );
}
const router = createBrowserRouter([
  {
      path: "/",
      element: <Root />,
      errorElement: <Voter />,
      children: [
          {
              path: "",
              element: <Voter />,
          },

          {
              path: "admin",
              element: <Admin />,
          }
      ],
  },
]);

function App() {
  return (
      <div>
          <RouterProvider router={router} />
      </div>
  );
}

export default App;
