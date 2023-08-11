export const splitMarkdownToChunks = (
  markdownText: string,
  maxLength: number = 2500,
): string[] => {
  const lines = markdownText.split('\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const line of lines) {
    let lineIndex = 0;
    while (lineIndex < line.length) {
      const spaceLeft = maxLength - currentChunk.length;
      const endIndex = Math.min(lineIndex + spaceLeft, line.length);
      const subLine = line.substring(lineIndex, endIndex);

      currentChunk += subLine;

      if (currentChunk.length >= maxLength) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      lineIndex = endIndex;
    }

    if (currentChunk.length > 0) {
      currentChunk += '\n';
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};
