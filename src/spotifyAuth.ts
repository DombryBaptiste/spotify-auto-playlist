/* eslint-disable @typescript-eslint/no-unused-vars */
// src/spotifyAuth.ts
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;

// Local ou GitHub Pages (on détecte automatiquement)
const REDIRECT_URI = `${window.location.origin}${
  window.location.pathname.startsWith("/spotify-auto-playlist") ? "/spotify-auto-playlist" : ""
}/callback`;

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
  // ajoute d'autres scopes selon tes besoins (playlists etc.)
];

function randomString(length = 64) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let text = "";
  const values = crypto.getRandomValues(new Uint8Array(length));
  values.forEach(v => (text += possible[v % possible.length]));
  return text;
}

async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest("SHA-256", data);
}

function base64urlEncode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let str = "";
  bytes.forEach(b => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function startSpotifyLogin() {
  if (!CLIENT_ID) {
    throw new Error("VITE_SPOTIFY_CLIENT_ID manquant dans .env");
  }
  console.log(REDIRECT_URI)

  const codeVerifier = randomString(96);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64urlEncode(hashed);

  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(" "),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// À appeler sur /callback?code=...
export async function exchangeCodeForToken(code: string) {
  const codeVerifier = localStorage.getItem("spotify_code_verifier");
  if (!codeVerifier) throw new Error("code_verifier introuvable (localStorage).");

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${txt}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
  };

  // Stockage simple (tu pourras améliorer ensuite)
  localStorage.setItem("spotify_access_token", data.access_token);
  localStorage.setItem("spotify_expires_at", String(Date.now() + data.expires_in * 1000));

  // refresh_token peut exister avec PKCE
  if (data.refresh_token) localStorage.setItem("spotify_refresh_token", data.refresh_token);

  // ✅ Notifie l'app que l'utilisateur s'est connecté
  window.dispatchEvent(new Event("spotify-auth-changed"));

  return data;
}
