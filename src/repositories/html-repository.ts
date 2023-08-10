import { callFirebaseFunction } from '../helpers/firebase-functions-helper';
import { convertHtmlToMarkdown } from '../utils/html-to-markdown';

// type FetchHtmlParams = { url: string };
// type FetchHtmlRes = { html: string } | { error: string };
const fetchHtml = async (url: string) => {
  const result = await callFirebaseFunction('fetch_html', { url });
  const { data } = result;
  if (!data) {
    throw new Error('No data returned');
  }
  const { html, error } = data;
  if (error) {
    throw new Error(error);
  }
  if (typeof html !== 'string') {
    throw new Error('No html returned');
  }
  return html;
};

export const fetchMarkdown = async (url: string): Promise<string> => {
  const html = await fetchHtml(url);
  const markdown = convertHtmlToMarkdown(html);
  return markdown;
};
