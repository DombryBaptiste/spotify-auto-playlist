import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken } from "./spotifyAuth";

export default function Callback() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      navigate("/");
      return;
    }

    // Nettoie l’URL
    window.history.replaceState({}, document.title, window.location.pathname);

    exchangeCodeForToken(code)
      .finally(() => {
        // ✅ retour à l’accueil après login
        navigate("/");
      });
  }, [navigate]);

  return <p style={{ padding: 24 }}>Connexion Spotify…</p>;
}
