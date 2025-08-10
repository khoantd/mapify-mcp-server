// Example usage of the Mapify MCP Server deployed on Cloudflare Workers
// Replace 'your-worker.your-subdomain.workers.dev' with your actual worker URL

const WORKER_URL = 'https://your-worker.your-subdomain.workers.dev';

// Example 1: Generate mind map from text prompt
async function generateFromText() {
  try {
    const response = await fetch(`${WORKER_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Machine Learning fundamentals',
        mode: 'prompt',
        language: 'en'
      })
    });

    const result = await response.json();
    console.log('Text Prompt Result:', result);
    
    if (result.success) {
      console.log('View mind map:', result.data.imageUrl);
      console.log('Edit mind map:', result.data.editUrl);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 2: Generate mind map from AI search
async function generateFromAISearch() {
  try {
    const response = await fetch(`${WORKER_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'climate change solutions 2025',
        mode: 'ai-search',
        language: 'en'
      })
    });

    const result = await response.json();
    console.log('AI Search Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 3: Generate mind map from YouTube video
async function generateFromYouTube() {
  try {
    const response = await fetch(`${WORKER_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'https://youtube.com/watch?v=dQw4w9WgXcQ', // Replace with actual video
        mode: 'youtube',
        language: 'en'
      })
    });

    const result = await response.json();
    console.log('YouTube Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 4: Generate mind map from website
async function generateFromWebsite() {
  try {
    const response = await fetch(`${WORKER_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'https://nodejs.org/en/docs/',
        mode: 'website',
        language: 'en'
      })
    });

    const result = await response.json();
    console.log('Website Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 5: Health check
async function healthCheck() {
  try {
    const response = await fetch(`${WORKER_URL}/health`);
    const result = await response.json();
    console.log('Health Check:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 6: Get API documentation
async function getApiDocs() {
  try {
    const response = await fetch(`${WORKER_URL}/docs`);
    const result = await response.json();
    console.log('API Documentation:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run examples
async function runExamples() {
  console.log('🧪 Testing Mapify MCP Server API...\n');
  
  await healthCheck();
  console.log('\n---\n');
  
  await getApiDocs();
  console.log('\n---\n');
  
  await generateFromText();
  console.log('\n---\n');
  
  // Uncomment to test other examples
  // await generateFromAISearch();
  // await generateFromYouTube();
  // await generateFromWebsite();
}

// Run if this file is executed directly
if (typeof window === 'undefined') {
  runExamples();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateFromText,
    generateFromAISearch,
    generateFromYouTube,
    generateFromWebsite,
    healthCheck,
    getApiDocs
  };
}
