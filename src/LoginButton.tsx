import { logout } from "./services/spotifyAPIService";
import { startSpotifyLogin } from "./spotifyAuth";

export default function LoginButton({isConnected}: {isConnected: boolean}) {
    
    return (
        isConnected ? (
            <button onClick={() => {logout() }}> Déconnexion </button>
        ) : (
            <button onClick={() => {startSpotifyLogin()}}> Connexion avec Spotify </button>
        )
    )
}