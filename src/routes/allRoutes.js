import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Password from "../pages/Authentication/ForgetPassword";

import UserProfile from "../pages/Authentication/user-profile";

const userRoutes = [
  //dashboard
  { path: "/dashboard", component: <Dashboard/> },

  //profile
  { path: "/profile", component: <UserProfile/> },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const authRoutes = [
  //authencation page
  { path: "/auth/logout", component: <Logout/> },
  { path: "/auth/login", component: <Login/> },
  { path: "/auth/forgot", component: <Password/> },
];

export { userRoutes, authRoutes };
