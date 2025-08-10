import { z } from "zod";
import { makeMapifyRequest } from "./requester-worker.js";

// Worker environment interface
interface Env {
  MAPIFY_API_KEY: string;
  KV?: KVNamespace;
}

// CORS headers for responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Request/Response schemas
const GenerateMindmapSchema = z.object({
  prompt: z.string().describe("The prompt to generate the mind map"),
  mode: z.enum(["prompt", "ai-search", "youtube", "website"]).default("prompt"),
  language: z.enum([
    "id", "ms", "da", "de", "en", "es", "fr", "it", "nl", "no", "pl", "pt", 
    "ro", "fi", "sv", "vi", "tr", "hu", "cs", "uk", "ru", "bg", "ar", "fa", 
    "he", "hi", "th", "ja", "zh-CN", "zh-TW", "ko"
  ]).default("en"),
});

// Health check endpoint
function handleHealthCheck(): Response {
  return new Response(JSON.stringify({ 
    status: 'ok', 
    service: 'mapify-mcp-server',
    version: '1.0.1',
    timestamp: new Date().toISOString()
  }), {
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders 
    }
  });
}

// Main mind map generation endpoint
async function handleGenerateMindmap(request: Request, env: Env): Promise<Response> {
  try {
    // Check API key
    if (!env.MAPIFY_API_KEY) {
      return new Response(JSON.stringify({
        error: 'API key not configured',
        message: 'MAPIFY_API_KEY environment variable is required'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Parse request body
    const body = await request.json();
    const validatedInput = GenerateMindmapSchema.parse(body);
    
    let { prompt, mode, language } = validatedInput;

    // Handle URL cleaning for youtube/website modes
    if (mode === "youtube" || mode === "website") {
      if (prompt.startsWith("@")) {
        prompt = prompt.slice(1);
      }
    }

    let result;
    try {
      // Make the request to Mapify API
      result = await makeMapifyRequest(prompt, mode, language, env.MAPIFY_API_KEY);

      // Handle API errors
      if (result.code !== 0) {
        const errorMessage = result.code === 10006
          ? 'Insufficient Mapify credits to generate a mind map'
          : result.code === 102
          ? 'Invalid or missing MAPIFY_API_KEY'
          : `Failed to generate mind map: ${result.message}`;

        return new Response(JSON.stringify({
          error: 'Mapify API Error',
          message: errorMessage,
          code: result.code
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    } catch (error) {
      console.error('Mapify API request failed:', error);
      
      return new Response(JSON.stringify({
        error: 'Mapify API Request Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'The request to Mapify API failed. Please check your API key and credits.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check if data exists
    if (!result.data) {
      return new Response(JSON.stringify({
        error: 'Invalid Response',
        message: 'No data received from Mapify API'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Return successful response
    return new Response(JSON.stringify({
      success: true,
      message: 'Mind map generated successfully',
      data: {
        imageUrl: result.data.image,
        editUrl: result.data.continual,
        prompt,
        mode,
        language
      }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('Error generating mind map:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({
        error: 'Validation Error',
        message: 'Invalid request parameters',
        details: error.errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// API documentation endpoint
function handleApiDocs(): Response {
  const documentation = {
    service: "Mapify MCP Server",
    version: "1.0.1",
    description: "Transform text, YouTube videos, and web content into beautiful mind maps using AI",
    endpoints: {
      "GET /": "Health check endpoint",
      "GET /health": "Health check endpoint",
      "POST /generate": "Generate a mind map",
      "GET /docs": "This API documentation"
    },
    generateEndpoint: {
      method: "POST",
      url: "/generate",
      description: "Generate a mind map from various inputs",
      requestBody: {
        prompt: "string - The content or URL to generate mind map from",
        mode: "string - One of: prompt, ai-search, youtube, website (default: prompt)",
        language: "string - Language code for the mind map (default: en)"
      },
      responseBody: {
        success: "boolean",
        message: "string",
        data: {
          imageUrl: "string - URL to view the generated mind map image",
          editUrl: "string - URL to edit the mind map online",
          prompt: "string - The processed prompt",
          mode: "string - The generation mode used",
          language: "string - The language used"
        }
      }
    },
    supportedLanguages: [
      "id", "ms", "da", "de", "en", "es", "fr", "it", "nl", "no", "pl", "pt", 
      "ro", "fi", "sv", "vi", "tr", "hu", "cs", "uk", "ru", "bg", "ar", "fa", 
      "he", "hi", "th", "ja", "zh-CN", "zh-TW", "ko"
    ],
    examples: {
      textPrompt: {
        prompt: "Machine Learning fundamentals",
        mode: "prompt",
        language: "en"
      },
      aiSearch: {
        prompt: "climate change solutions 2025",
        mode: "ai-search",
        language: "en"
      },
      youtube: {
        prompt: "https://youtube.com/watch?v=example",
        mode: "youtube",
        language: "en"
      },
      website: {
        prompt: "https://example.com/article",
        mode: "website",
        language: "en"
      }
    }
  };

  return new Response(JSON.stringify(documentation, null, 2), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

// Handle CORS preflight requests
function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Main worker export
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    // Route requests
    switch (url.pathname) {
      case '/':
      case '/health':
        return handleHealthCheck();
      
      case '/generate':
        if (method === 'POST') {
          return handleGenerateMindmap(request, env);
        }
        break;
      
      case '/docs':
        return handleApiDocs();
      
      default:
        return new Response(JSON.stringify({
          error: 'Not Found',
          message: `Endpoint ${url.pathname} not found`,
          availableEndpoints: ['/', '/health', '/generate', '/docs']
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    return new Response(JSON.stringify({
      error: 'Method Not Allowed',
      message: `Method ${method} not allowed for ${url.pathname}`
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};
