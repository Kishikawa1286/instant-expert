import { ModelName } from '../helpers/web-llm/llm-config';
import { ChatManager, chatManager } from '../helpers/web-llm/web-llm-helper';
import { executeSequentially } from '../utils/execute-sequentially';
import { splitMarkdownToChunks } from '../utils/split-markdown';

export { modelNames } from '../helpers/web-llm/llm-config';

type LLMoption = { model: ModelName };

export const getChatResponse = async (
  prompt: string,
  manager: ChatManager,
  progressCallback?: (step: number, currentMessage: string) => void,
): Promise<string> => {
  try {
    const response = await manager.generate(prompt, progressCallback);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating chat response:', error);
      return error.message;
    } else {
      console.error('Error generating chat response');
      return 'Error generating chat response';
    }
  }
};

const summarizePrompt = (text: string): string =>
  `As an excellent translator who understands every language, your task is to summarize the text enclosed in \`\`\` marks.
The text will be provided in Markdown format, generated from a website, and may be partial if too long.
Create a summary in English, regardless of the original language, in no more than 500 words.
If the meaning of the text is unclear, provide a very short explanation.
Indicate the language name in parentheses at the beginning of the generated summary, like "(Spanish) ...".
If program code is provided, give a concise description of the input, output, and the main purpose of the code.
  
\`\`\`
${text}
\`\`\``;

export const summarize = async (
  text: string,
  option: LLMoption,
): Promise<string[]> => {
  const chunks = splitMarkdownToChunks(text);
  const manager = chatManager(option.model);
  const summaries = await executeSequentially(chunks, async (chunk) => {
    const summary = await getChatResponse(
      summarizePrompt(chunk),
      manager,
      (_step, msg) => console.log(msg),
    );
    await manager.resetChat();
    return summary;
  });
  await manager.unloadChat();
  return summaries;
};
