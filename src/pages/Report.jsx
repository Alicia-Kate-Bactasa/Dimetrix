import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Report() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page with report modal query parameter open
    navigate("/?report=true", { replace: true });
  }, [navigate]);

  return null;
}