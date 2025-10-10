import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

// pages

import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";
import Profile from "../pages/user/Profile";
import Dashboard from "../pages/dashboard/Dashboard";
import Home from "../pages/Home";

// Auth Context

import { useAuth } from "./authContext";

const Routes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userId");

    if (user && !currentUser) {
      setCurrentUser(user);
    }

    if (!user && !["/login", "/signup"].includes(window.location.pathname)) {
      navigate("/");
    }

    if (user && window.location.pathname === "/login") {
      navigate("/dashboard");
    }
  }, [currentUser, navigate, setCurrentUser]);

  const routes = useRoutes([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
  ]);

  return routes;
};

export default Routes;
