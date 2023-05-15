import Dashboard from "../components/adminDashboard/Dashboard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../customHooks/useAuth";
import React, { useEffect } from "react";

const AdminDashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.user) {
      navigate("/");
    }
  });

  return <Dashboard />;
};

export default AdminDashboard;
