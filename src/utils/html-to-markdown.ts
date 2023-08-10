import TurndownService from 'turndown';

export const convertHtmlToMarkdown = (html: string) => {
  // Create an instance of the Turndown service
  const turndownService = new TurndownService();

  // Find the position of the first h tag
  const firstHTagIndex = Math.min(
    ...['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
      const index = html.indexOf(`<${tag}>`);
      return index === -1 ? Infinity : index;
    }),
  );

  // Remove content before the h tag
  if (firstHTagIndex !== Infinity) {
    html = html.substring(firstHTagIndex);
  }

  // Convert HTML to Markdown
  const markdown = turndownService.turndown(html);

  return markdown;
};
