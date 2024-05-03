import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Password from "../pages/Authentication/ForgetPassword";

import UserProfile from "../pages/Authentication/user-profile";
import ManageParent from "../pages/ManageParent";
import ManageChild from "../pages/manageChild";
import ManageTeacher from "../pages/ManageTeacher";
import ManageSites from "../pages/ManageSites";
import ManageTimetable from "../pages/ManageTimetable";
import Settings from "../pages/Settings";
import ManagePackage from "../pages/managePackage";
import ManageProgram from "../pages/manageProgram";
import ManageProgramUnpaid from "../pages/manageProgramUnpaid";
import ManageProgramInactive from "../pages/manageProgramInactive";
import ManageSwap from "../pages/ManageSwap";
import ManageSurvey from "../pages/ManageSurvey";
import ManageCoupon from "../pages/ManageCoupon";

const userRoutes = [
  //dashboard
  { path: "/dashboard", component: <Dashboard /> },

  { path: "/manage-parent", component: <ManageParent /> },

  { path: "/manage-child", component: <ManageChild /> },

  { path: "/manage-teacher", component: <ManageTeacher /> },

  { path: "/manage-sites", component: <ManageSites /> },

  { path: "/manage-program", component: <ManageProgram/> },

  { path: "/manage-program-unpaid", component: <ManageProgramUnpaid/> },

  { path: "/manage-program-inactive", component: <ManageProgramInactive/> },

  { path: "/manage-timetable", component: <ManageTimetable /> },

  { path: "/manage-package", component: <ManagePackage/> },

  { path: "/manage-swap", component: <ManageSwap/> },

  { path: "/manage-survey", component: <ManageSurvey/> },
  { path: "/manage-coupon", component: <ManageCoupon/> },


  { path: "/settings", component: <Settings /> },

  //profile
  { path: "/profile", component: <UserProfile /> },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const authRoutes = [
  //authencation page
  { path: "/auth/logout", component: <Logout /> },
  { path: "/auth/login", component: <Login /> },
  { path: "/auth/forgot", component: <Password /> },
];

export { userRoutes, authRoutes };
