const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
        cache: 'no-store'
    });

    return response.json();
}

export async function getNowPlaying(clientId?: string, clientSecret?: string, refreshToken?: string) {
    // Priority: User keys from headers/args > Environment variables
    const cId = clientId || process.env.SPOTIFY_CLIENT_ID;
    const cSecret = clientSecret || process.env.SPOTIFY_CLIENT_SECRET;
    const rToken = refreshToken || process.env.SPOTIFY_REFRESH_TOKEN;

    if (!cId || !cSecret || !rToken || cId === "your_spotify_client_id_here") {
        return { status: 401 }; // Missing credentials
    }

    const { access_token } = await getAccessToken(cId, cSecret, rToken);

    if (!access_token) return { status: 401 };

    return fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        cache: 'no-store'
    });
}
