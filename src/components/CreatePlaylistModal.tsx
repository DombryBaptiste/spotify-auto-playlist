import Modal from "react-modal";
import { useState } from "react";
import "./CreatePlaylistModal.css";
import { createPlaylist } from "../services/spotifyAPIService";
import toastService from "../services/toastService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreatePlaylistModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleClickCreatePlaylist(
    playlistName: string,
    description: string,
  ) {
    if (!playlistName) {
      toastService.error("Le nom de la playlist est requis.");
      return;
    }
    createPlaylist(playlistName, description)
      .then(() => {
        toastService.success("Playlist créée avec succès !");
        onClose();
        setName("");
        setDescription("");
      })
      .catch(() => {
        toastService.error("Erreur lors de la création de la playlist.");
      });
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>Créer une playlist</h2>
      <div className="form-group">
        <label htmlFor="playlistName">Nom de la playlist *</label>

        <input
          id="playlistName"
          type="text"
          placeholder="Ex: Mes sons préférés"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="playlistDesc">Description</label>

        <input
          id="playlistDesc"
          type="text"
          placeholder="Optionnel"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        onClick={() => {
          handleClickCreatePlaylist(name, description);
        }}
      >
        Créer la playlist
      </button>
    </Modal>
  );
}
