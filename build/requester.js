const MAPIFY_API = "https://staging.mapify.so/api/v1/preview-mind-maps";
export async function makeMapifyRequest(prompt, mode, language) {
    const response = await fetch(MAPIFY_API, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + process.env.MAPIFY_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt,
            mode: mode,
            language: language,
            from: "mcp",
        }),
    });
    return await response.json();
}
