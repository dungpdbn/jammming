let accessToken;
let clientID = '15c9b7552b7f40f38404b22a518d02fa';
let redirectUri = 'https://jammming-dungpdbn.netlify.app/'

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl;
        }
    },

    async search(term) {
        const accessToken = Spotify.getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
        );
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            console.log(jsonResponse);
            return [];
        }
        return jsonResponse.tracks.items.map(track => {
            return {
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            };
        });

   },

    async savePlaylist(name, trackUris) {
       if (!name || !trackUris.length) return;
       const accessToken = Spotify.getAccessToken();
       const headers = { Authorization: 'Bearer ' + accessToken };
       let userId;

       const response = await fetch('https://api.spotify.com/v1/me', {
            headers: headers
        });
        const jsonResponse = await response.json();
        userId = jsonResponse.id;
        const response_1 = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name: name })
        });
        const jsonResponse_1 = await response_1.json();
        const playlistId = jsonResponse_1.id;
        return await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackUris })
        });
       

   }

}

export default Spotify;