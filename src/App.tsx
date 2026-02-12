import "./App.css";
import { Me, logout, TOKEN_KEY } from "./services/spotifyAPIService";
import { useEffect, useState } from "react";
import LoginButton from "./LoginButton";
import UserProfile from "./components/UserProfile";
import Modal from "react-modal";
import type { SpotifyUser } from "./types/spotify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

function App() {
  const title = "Spotify Auto Playlist";

  const [isConnected, setIsConnected] = useState(
    () => !!localStorage.getItem("spotify_access_token"),
  );

  const [me, setMe] = useState<SpotifyUser | null>(null);

  // écoute login / logout
  useEffect(() => {
    const handler = () => setIsConnected(!!localStorage.getItem(TOKEN_KEY));

    window.addEventListener("spotify-auth-changed", handler);
    return () => window.removeEventListener("spotify-auth-changed", handler);
  }, []);

  // charge profil quand connecté
  useEffect(() => {
    if (!isConnected) {
      return;
    }

    Me()
      .then(setMe)
      .catch(() => logout());
  }, [isConnected]);

  return (
    <div className="app-container">
      <div className="header">
        <p className="title">{title}</p>
      </div>

      {!isConnected && (
        <div className="bodyUser">
          <LoginButton isConnected={false} />
          <p>Connectez-vous pour accéder à votre compte Spotify</p>
        </div>
      )}

      {isConnected && me && <UserProfile user={me} />}
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
