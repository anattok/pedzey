import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { Store } from "./pages/Store/Store.tsx";
import { Layout } from "./layout/Layout.tsx";
import { RequireAuth } from "./helpers/RequireAuth.tsx";
import { AuthLayout } from "./layout/Auth/AuthLayout.tsx";
import { Login } from "./pages/Login/Login.tsx";

import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { Table } from "./pages/Table/Table.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        path: "table",
        element: <Table />,
      },
      {
        path: "store",
        element: <Store />,
      },
      {
        path: "*",
        element: <Navigate to="/store" />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [{ path: "login", element: <Login /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
