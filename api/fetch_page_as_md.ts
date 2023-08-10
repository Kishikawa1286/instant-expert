import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export default async (request: VercelRequest, response: VercelResponse) => {
  const targetURL = request.query.url;

  if (!targetURL) {
    return response.status(400).json({ error: 'URL is required' });
  }

  const browserlessAPIEndpoint = 'https://chrome.browserless.io/content';
  const browserlessAPIKey = process.env.BROWSERLESS_API_KEY;

  const headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({ url: targetURL });

  try {
    const browserlessResponse = await fetch(
      `${browserlessAPIEndpoint}?token=${browserlessAPIKey}`,
      {
        method: 'POST',
        headers: headers,
        body: body,
      },
    );

    const htmlContent = await browserlessResponse.text();

    return response.status(200).send(htmlContent);
  } catch (error) {
    return response.status(500).json({ error: 'Failed to fetch content from Browserless' });
  }
};
