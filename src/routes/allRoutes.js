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
import ManageSwap from "../pages/ManageSwap";
import ManageSurvey from "../pages/ManageSurvey";
import ManageCoupon from "../pages/ManageCoupon";
import ManageCohort from "../pages/manageCohort";
import ManageTestimonial from "../pages/ManageTestimonial";
import ManagePartner from "../pages/ManagePartner";
import ParnerDashboard from "../pages/ManagePartner/PartnerDashboard";
import PartnerParent from "../pages/ManagePartner/PartnerParent";
import PartnerChild from "../pages/ManagePartner/PartnerChild";
import PartnerProgram from "../pages/ManagePartner/PartnerProgram";
import ManagePartnerProgram from "../pages/managePartnerPrograms/ManagePartnerProgram";

const userRoutes = [
  //dashboard
  { path: "/dashboard", component: <Dashboard /> },

  { path: "/manage-parent", component: <ManageParent /> },

  { path: "/manage-child", component: <ManageChild /> },

  { path: "/manage-teacher", component: <ManageTeacher /> },

  { path: "/manage-sites", component: <ManageSites /> },

  { path: "/manage-program", component: <ManageProgram/> },

  { path: "/manage-program-unpaid", component: <ManageProgramUnpaid/> },

  { path: "/manage-cohort", component: <ManageCohort/> },

  { path: "/manage-timetable", component: <ManageTimetable /> },

  { path: "/manage-package", component: <ManagePackage/> },

  { path: "/manage-swap", component: <ManageSwap/> },

  { path: "/manage-survey", component: <ManageSurvey/> },

  { path: "/manage-coupon", component: <ManageCoupon/> },

  { path: "/manage-partner", component: <ManagePartner/> },
  
  { path: "/manage-testimonial", component: <ManageTestimonial/> },

  { path: "/settings", component: <Settings /> },

  { path: "/manage-partner-program", component: <ManagePartnerProgram /> },

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

const partnerRoutes = [
  //authencation page
  { path: "/partner/dashboard/:id", component: <ParnerDashboard /> },
  { path: "/partner/manage-parent/:id", component: <PartnerParent /> },
  { path: "/partner/manage-child/:id", component: <PartnerChild /> },
  { path: "/partner/manage-program/:id", component: <PartnerProgram /> },
];

export { userRoutes, authRoutes, partnerRoutes };
