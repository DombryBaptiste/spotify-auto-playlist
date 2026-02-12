import { useState } from "react";
import { logout } from "../services/spotifyAPIService";
import "./UserProfile.css";
import CreatePlaylistModal from "./CreatePlaylistModal";
import ImportPlaylist from "./ImportPlaylist";

type Props = {
  user: {
    id: string;
    display_name?: string;
    images?: { url: string }[];
    email?: string;
  };
};

export default function UserProfile({ user }: Props) {
  const [openAddPlaylist, setOpenAddPlaylist] = useState(false);
  const [openImportPlaylist, setOpenImportPlaylist] = useState(false);

  return (
    <div className="bodyUser">
      {user.images?.[0] && (
        <img src={user.images[0].url} width={80} style={{ borderRadius: "50%" }} />
      )}

      <h3>{user.display_name}</h3>
      <p>{user.email}</p>

      <button onClick={() => setOpenAddPlaylist(true)}>Créer une playlist</button>
      <button onClick={() => setOpenImportPlaylist(true)}>Importer dans une playlist</button>
      <button onClick={logout}>Déconnexion</button>

      <CreatePlaylistModal isOpen={openAddPlaylist} onClose={() => setOpenAddPlaylist(false)} />
      <ImportPlaylist isOpen={openImportPlaylist} onClose={() => setOpenImportPlaylist(false)} />
    </div>
  );
}
