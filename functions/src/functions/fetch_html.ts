import { BROWSERLESS_API_KEY } from '../utils/env';
import { functions256MB } from '../utils/functions';

type FetchHtmlParams = { url: string };
type FetchHtmlRes = { html: string } | { error: string };

export const fetchHtml = functions256MB.https.onCall(
  async (data: FetchHtmlParams, context): Promise<FetchHtmlRes> => {
    const { url } = data;

    if (!url) {
      return { error: 'URL is required' };
    }

    const browserlessAPIEndpoint = 'https://chrome.browserless.io/content';
    const headers = {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    };

    const body = JSON.stringify({ url });

    try {
      const browserlessResponse = await fetch(
        `${browserlessAPIEndpoint}?token=${BROWSERLESS_API_KEY}`,
        {
          method: 'POST',
          headers: headers,
          body: body,
        },
      );

      const htmlContent = await browserlessResponse.text();

      return { html: htmlContent };
    } catch (error) {
      return { error: 'Failed to fetch content from Browserless' };
    }
  },
);
