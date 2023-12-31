import {
  ChatManager as _ChatManager,
  chatManager,
} from '../helpers/web-llm/web-llm-helper';
import { executeSequentially } from '../utils/execute-sequentially';
import { splitMarkdownToChunks } from '../utils/split-markdown';

export { modelNames } from '../helpers/web-llm/llm-config';

export type ChatManager = _ChatManager;

export const createChatManager = () =>
  chatManager('Llama-2-7b-chat-hf-q4f32_1', {
    repetition_penalty: 1,
    top_p: 0.95,
    temperature: 0.7,
  });

export const getChatResponse = async (
  prompt: string,
  manager: _ChatManager,
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

export const resetChat = async (manager: _ChatManager): Promise<void> => {
  await manager.resetChat();
};

export const interruptChat = (manager: _ChatManager): void => {
  manager.interrupt();
};

const summarizePrompt = (text: string): string =>
  `Write a creative title and subtitle for the text.
\`\`\`
${text}
\`\`\``;

export const summarize = async (text: string): Promise<string[]> => {
  const chunks = splitMarkdownToChunks(text, 1500);
  const manager = chatManager('vicuna-v1-7b-q4f32_0', {
    conv_config: {
      seps: ['\n', '```'],
      roles: ['USER', 'ASSISTANT'],
    },
    repetition_penalty: 2,
    top_p: 0.97,
    temperature: 0.3,
    mean_gen_len: 150,
  });
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
