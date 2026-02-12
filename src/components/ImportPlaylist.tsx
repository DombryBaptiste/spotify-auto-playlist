import Modal from "react-modal";
import { useEffect, useState } from "react";
import {
  addTracksToPlaylist,
  getAllPlaylist,
  getTrack,
} from "../services/spotifyAPIService";
import type { SpotifyPaging, SpotifyPlaylist } from "../types/spotify";
import ConfirmImport from "./ConfirmImport";
import toastService from "../services/toastService";

type Playlist = {
  id: string;
  name: string;
};
type TrackTuple = [title: string, artist: string];

type MatchedTrack = {
  fromFile: TrackTuple;
  fromSpotify: TrackTuple | null;
  idSpotify: string | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ImportPlaylist({ isOpen, onClose }: Props) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [fileImportedFinished, setFileImportedFinished] = useState(false);

  const [matches, setMatches] = useState<MatchedTrack[] | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    getAllPlaylist().then((res: SpotifyPaging<SpotifyPlaylist>) => {
      setPlaylists(res.items);
    });
  }, [isOpen]);

  function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileImportedFinished(false);
    setFile(file);

    const reader = new FileReader();

    reader.onload = async (event) => {
      const content = String(event.target?.result ?? "");
      const formated = parseTxtTracks(content);

      const m = await getTrackFromSpotify(formated);
      console.log("Matches trouvés :", m);
      setMatches(m);
      setFileImportedFinished(true);
    };

    reader.readAsText(file);
  }

  function parseTxtTracks(content: string): TrackTuple[] {
    return content
      .split(";")
      .map((track) => track.trim())
      .filter(Boolean)
      .map((entry) => {
        const [title, artist] = entry.split(":").map((part) => part.trim());
        return [title, artist] as TrackTuple;
      });
  }

  function importSelectedTracks(spotifyIds: string[]) {
    if(!selectedId)
    {
      toastService.error("Veuillez sélectionner une playlist pour importer les pistes.");
      return;
    }
    if (!spotifyIds || spotifyIds.length === 0)
    {
      toastService.error("Aucune piste sélectionnée pour l'importation.");
      return;
    }
    console.log("Importing tracks to playlist:", selectedId, spotifyIds);

    addTracksToPlaylist(selectedId, spotifyIds).then(() => {
      toastService.success("Pistes importées avec succès !");
      onClose();
      resetState();
    }).catch((err) => {
      toastService.error("Erreur lors de l'importation des pistes." + err.message);
    });
  }

  function resetState() {
    setSelectedId("");
    setFile(null);
    setFileImportedFinished(false);
    setMatches(null);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  async function getTrackFromSpotify(
    tracks: TrackTuple[],
  ): Promise<MatchedTrack[]> {
    const matches = await Promise.all(
      tracks.map(async ([title, artist]) => {
        try {
          const res = await getTrack(title, artist);
          const spotifyTrack = res.tracks.items[0];

          if (!spotifyTrack) {
            return {
              fromFile: [title, artist] as TrackTuple,
              fromSpotify: null,
              idSpotify: null,
            } satisfies MatchedTrack;
          }

          return {
            fromFile: [title, artist] as TrackTuple,
            fromSpotify: [
              spotifyTrack.name,
              spotifyTrack.artists?.[0]?.name ?? "",
            ] as TrackTuple,
            idSpotify: spotifyTrack.id ?? null,
          } satisfies MatchedTrack;
        } catch {
          return {
            fromFile: [title, artist] as TrackTuple,
            fromSpotify: null,
            idSpotify: null,
          } satisfies MatchedTrack;
        }
      }),
    );

    return matches;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>Importer une playlist</h2>

      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="modal-input"
      >
        <option value="">— Sélectionner une playlist —</option>

        {playlists.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <p>{file?.name}</p>
      {fileImportedFinished && matches && (
        <div>
          <ConfirmImport matches={matches} onConfirm={importSelectedTracks} />
        </div>
      )}

      <div className="modal-actions">
        <input
          type="file"
          accept=".txt"
          id="fileImport"
          hidden
          onChange={handleFileImport}
        />

        <button onClick={() => document.getElementById("fileImport")?.click()}>
          Choisir un fichier
        </button>
        <button onClick={onClose}>Annuler</button>
      </div>
    </Modal>
  );
}
