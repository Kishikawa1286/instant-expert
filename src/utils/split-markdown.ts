export const splitMarkdownToChunks = (
  markdownText: string,
  maxLength: number = 2500,
): string[] => {
  const lines = markdownText.split('\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const line of lines) {
    if (line.length > maxLength) {
      let startIndex = 0;
      while (startIndex < line.length) {
        const subLine = line.substring(startIndex, maxLength);
        if (currentChunk.length + subLine.length > maxLength) {
          chunks.push(currentChunk);
          currentChunk = subLine;
        } else {
          currentChunk += subLine;
        }
        startIndex += maxLength;
      }
      continue;
    }

    if (currentChunk.length + line.length > maxLength) {
      chunks.push(currentChunk);
      currentChunk = line + '\n';
      continue;
    }

    currentChunk += line + '\n';
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};
