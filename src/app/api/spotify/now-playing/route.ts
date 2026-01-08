import { NextRequest, NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/api/spotify";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        // Get credentials from headers
        const clientId = req.headers.get("x-spotify-client-id");
        const clientSecret = req.headers.get("x-spotify-client-secret");
        const refreshToken = req.headers.get("x-spotify-refresh-token");

        const response = (await getNowPlaying(
            clientId || undefined,
            clientSecret || undefined,
            refreshToken || undefined
        )) as Response;

        if (!response || response.status === 204 || response.status > 400) {
            return NextResponse.json({ isPlaying: false });
        }

        const song = (await response.json()) as {
            is_playing: boolean;
            item: {
                name: string;
                artists: { name: string }[];
                album: {
                    name: string;
                    images: { url: string }[];
                };
                external_urls: { spotify: string };
                duration_ms: number;
            } | null;
            progress_ms: number;
        };

        if (song.item === null) {
            return NextResponse.json({ isPlaying: false });
        }

        const isPlaying = song.is_playing;
        const title = song.item.name;
        const artist = song.item.artists.map((_artist: { name: string }) => _artist.name).join(", ");
        const album = song.item.album.name;
        const albumImageUrl = song.item.album.images[0].url;
        const songUrl = song.item.external_urls.spotify;
        const progressMs = song.progress_ms;
        const durationMs = song.item.duration_ms;

        return NextResponse.json({
            isPlaying,
            title,
            artist,
            album,
            albumImageUrl,
            songUrl,
            progressMs,
            durationMs,
        });
    } catch (error) {
        console.error("Spotify API Error:", error);
        return NextResponse.json({ isPlaying: false, error: "Internal Server Error" }, { status: 500 });
    }
}
