import {
  ISummary as _ISummary,
  ITenant as _ITenant,
  addTenant as _addTenant,
  deleteTenant as _deleteTenant,
  getAllTenants as _getAllTenants,
  addSummary,
  deleteSummariesByTenant,
  getAllSummaries,
} from '../helpers/db-helper';
import { fetchMarkdown } from './html-repository';
import { encodeToVector } from './sentence-encoding-repository';
import { summarize } from './web-llm-repository';

export type ISummary = _ISummary;

export type ITenant = _ITenant;

export const getAllTenants = _getAllTenants;

export const addTenant = (name: string) => _addTenant({ name });

export const deleteTenant = async (tenantId: number) => {
  await _deleteTenant(tenantId);
  await deleteSummariesByTenant(tenantId);
};

export const addMemory = async (url: string, tenantId: number) => {
  const markdownContent = await fetchMarkdown(url);

  const summaries = await summarize(markdownContent);

  const vectors = await encodeToVector(summaries);
  const vectorMagnitudes = vectors.map((vector) => {
    return vector.reduce((acc, cur) => acc + cur * cur, 0);
  });
  const normalizedVectors = vectors.map((vector, i) => {
    const magnitude = vectorMagnitudes[i];
    return vector.map((value) => value / magnitude);
  });

  for (let i = 0; i < summaries.length; i++) {
    const summaryData: ISummary = {
      tenantId: tenantId,
      original: markdownContent,
      summary: summaries[i],
      vector: vectors[i],
      normalizedVector: normalizedVectors[i],
      vectorMagnitude: vectorMagnitudes[i],
      url: url,
      index: i,
    };
    await addSummary(summaryData);
  }
};

export const searchMemory = async (
  tenantId: number,
  query: string,
  maxResults: number,
) => {
  const queryVector = (await encodeToVector([query]))[0];
  const queryVectorMagnitude = queryVector.reduce(
    (acc, cur) => acc + cur * cur,
    0,
  );
  const normalizedQueryVector = queryVector.map(
    (value) => value / (queryVectorMagnitude === 0 ? 1 : queryVectorMagnitude),
  );

  const memories = await getAllSummaries(tenantId);

  // Calculate cosine similarity between the query and each memory
  const similarities = memories.map((memory) => {
    const dotProduct = memory.normalizedVector.reduce(
      (sum, value, index) => sum + value * normalizedQueryVector[index],
      0,
    );
    return dotProduct;
  });

  // Sort memories based on their similarity to the query
  const sortedMemories = memories.sort((a, b) => {
    const simA = similarities[memories.indexOf(a)];
    const simB = similarities[memories.indexOf(b)];
    return simB - simA; // Sort in descending order
  });

  // Return the top n memories or all if there are less than n
  return sortedMemories.slice(0, maxResults);
};
