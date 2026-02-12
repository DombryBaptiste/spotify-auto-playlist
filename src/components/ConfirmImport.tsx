import React from "react";

type TrackTuple = [title: string, artist: string];

type MatchedTrack = {
  fromFile: TrackTuple;
  fromSpotify: TrackTuple | null;
  idSpotify: string | null;
};

export default function ConfirmImport({
  matches,
  onConfirm,
}: {
  matches: MatchedTrack[] | null;
  onConfirm: (spotifyIds: string[]) => void;
}) {
  const [checked, setChecked] = React.useState<Record<number, boolean>>({});

  // ✅ coche par défaut les lignes qui ont un match spotify
  React.useEffect(() => {
    if (!matches) return;
    const init: Record<number, boolean> = {};
    matches.forEach((m, i) => (init[i] = !!m.idSpotify));
    setChecked(init);
  }, [matches]);

  if (!matches || matches.length === 0) {
    return <div className="confirm-import-modal">Aucune donnée à afficher</div>;
  }

  const selectedSpotifyIds = matches
    .map((m, i) => (checked[i] ? m.idSpotify : null))
    .filter((id): id is string => !!id);

  return (
    <div className="confirm-import-modal">
      <div>
        {matches.map((match, index) => {
          const disabled = !match.idSpotify;

          return (
            <div key={index} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <input
                type="checkbox"
                disabled={disabled}
                checked={!!checked[index]}
                onChange={(e) =>
                  setChecked((prev) => ({ ...prev, [index]: e.target.checked }))
                }
              />

              <span style={{ opacity: disabled ? 0.6 : 1 }}>
                {match.fromFile[0]} - {match.fromFile[1]}
                {match.fromSpotify
                  ? ` => ${match.fromSpotify[0]} - ${match.fromSpotify[1]}`
                  : " => Aucun résultat trouvé"}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <button
          disabled={selectedSpotifyIds.length === 0}
          onClick={() => onConfirm(selectedSpotifyIds)}
        >
          Importer ({selectedSpotifyIds.length})
        </button>
      </div>
    </div>
  );
}
