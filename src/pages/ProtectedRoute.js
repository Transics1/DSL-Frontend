import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !allowedRoles.includes(user.role) || !token) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setIsValid(false);
        return;
      }

      try {
        await axios.get("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsValid(true);
      } catch (err) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setIsValid(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (isValid === null) return null; 

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return children;
}
