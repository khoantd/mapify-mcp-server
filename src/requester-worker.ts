const MAPIFY_API = "https://mapify.so/api/v1/preview-mind-maps";

// Type definition for Mapify API response
interface MapifyResponse {
  code: number;
  message?: string;
  data?: {
    image: string;
    continual: string;
  };
}

export async function makeMapifyRequest(
  prompt: string,
  mode: string,
  language: string,
  apiKey: string
): Promise<MapifyResponse> {
  // Use the global fetch available in Cloudflare Workers
  const response = await fetch(MAPIFY_API, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      mode: mode,
      language: language,
      from: "mcp",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
  }

  return await response.json() as MapifyResponse;
}
