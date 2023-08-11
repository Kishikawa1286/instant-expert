import { SentenceEncoder } from '../helpers/sentence-encoding-helper';

export const encodeToVector = async (texts: string[]): Promise<number[][]> => {
  const encoder = new SentenceEncoder();
  const vectors = await encoder.encodeSentences(texts);
  if (!vectors) {
    throw new Error('No vectors returned');
  }
  return vectors;
};
