export type SpotifyPaging<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
};

export type SpotifySearchTracksResponse = {
  tracks: SpotifyPaging<SpotifyTrack>;
}

export type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  tracks: {
    total: number;
  };
};

export type SpotifyImage = {
  url: string;
  height: number | null;
  width: number | null;
};

export type SpotifyUser = {
  id: string;
  display_name?: string;
  images?: { url: string }[];
  email?: string;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: SpotifySimplifiedArtist[];
}

export type SpotifySimplifiedArtist = {
  id: string;
  name: string;
}