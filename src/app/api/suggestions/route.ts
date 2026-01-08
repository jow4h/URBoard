
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const engine = searchParams.get('engine') || 'google';

    if (!query) {
        return NextResponse.json([]);
    }

    try {
        let suggestions: string[] = [];

        switch (engine) {
            case 'google':
                // Google Suggestions API
                const googleRes = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`);
                if (googleRes.ok) {
                    const data = await googleRes.json();
                    suggestions = data[1] || [];
                }
                break;

            case 'duckduckgo':
                // DuckDuckGo AC API
                const ddgRes = await fetch(`https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`);
                if (ddgRes.ok) {
                    const data = await ddgRes.json();
                    suggestions = data[1] || [];
                }
                break;

            case 'brave':
                // Brave Search API (Unofficial/Public)
                // Falling back to Google if Brave specific one is tricky or requires key, but there is a public suggests endpoint often used.
                // let's try a standard one, or use Google as high-quality fallback. 
                // Actually Brave often uses a similar standard. let's stick to Google for 'quality' if brave fails or is complex.
                // But let's try to be specific.
                const braveRes = await fetch(`https://search.brave.com/api/suggest?q=${encodeURIComponent(query)}`);
                if (braveRes.ok) {
                    const data = await braveRes.json();
                    // Brave returns: [query, [suggestions...]]
                    suggestions = data[1] || [];
                }
                break;



            default:
                // Fallback to Google
                const defRes = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`);
                if (defRes.ok) {
                    const data = await defRes.json();
                    suggestions = data[1] || [];
                }
                break;
        }

        return NextResponse.json(suggestions.slice(0, 8)); // Return top 8

    } catch (error) {
        console.error('Suggestion fetch error:', error);
        return NextResponse.json([]);
    }
}
