import type { SpotifyPaging, SpotifyPlaylist, SpotifySearchTracksResponse, SpotifyUser } from "../types/spotify";

const API = "https://api.spotify.com/v1";
export const TOKEN_KEY = "spotify_access_token";
const EXPIRES_AT_KEY = "spotify_expires_at";
const CODE_VERIFIER_KEY = "spotify_code_verifier";
const REFRESH_TOKEN_KEY= "spotify_refresh_token";

type Method = "GET" | "POST";


function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function isTokenExpired() {
    const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
    if(!expiresAt) return true;
    return Date.now() > Number(expiresAt);
}

async function spotifyFetch<T>(method: Method, url: string, body?: unknown): Promise<T> {
  const token = getToken();

  if (!token || isTokenExpired()) {
    logout();
    throw new Error("Token expiré");
  }

  const res = await fetch(API + url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }

  return res.json();
}



export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  localStorage.removeItem(CODE_VERIFIER_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.dispatchEvent(new Event("spotify-auth-changed"));
}

export function Me(): Promise<SpotifyUser> {
  return spotifyFetch("GET", "/me");
}

export function createPlaylist(name: string, description: string) {
  const body = {name, description, public: true, collaborative: false};
  return spotifyFetch("POST", "/me/playlists", body).then((res) => {
    console.log("Playlist créée:", res);
  });
}

export async function getAllPlaylist(): Promise<SpotifyPaging<SpotifyPlaylist>> {
  return spotifyFetch("GET", `/me/playlists`);
}

export async function getTrack(title: string, artist: string): Promise<SpotifySearchTracksResponse> {
  return spotifyFetch("GET", `/search?q=track:${encodeURIComponent(title)}%20artist:${encodeURIComponent(artist)}&type=track&limit=1`)
}

export async function addTracksToPlaylist(playlistId: string, trackIds: string[]) {
  const body = { uris: trackIds.map(id => `spotify:track:${id}`), position: 0 };
  console.log(body);
  return spotifyFetch("POST", `/playlists/${playlistId}/items`, body);
}