/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatInterface, ChatWorkerClient, ModelRecord } from '@mlc-ai/web-llm';
import { ModelName, appConfig } from './llm-config';

interface AppConfig {
  model_list: Array<ModelRecord>;
  model_lib_map?: Record<string, string>;
}

export class ChatManager {
  private chat: ChatInterface;
  private config: AppConfig = appConfig;
  private selectedModel: string;
  private chatLoaded = false;

  public requestInProgress = false;

  constructor(chat: ChatInterface, selectedModel: string) {
    this.chat = chat;
    this.selectedModel = selectedModel;
  }

  private async asyncInitChat() {
    if (this.chatLoaded) return;
    this.requestInProgress = true;

    try {
      const { model_lib_map } = this.config;
      if (!model_lib_map) {
        throw Error('model_lib_map is not defined');
      }
      if (this.selectedModel != 'Local Server') {
        await this.chat.reload(this.selectedModel, undefined, {
          model_list: this.config.model_list,
          model_lib_map,
        });
      }
      this.chatLoaded = true;
    } catch (err) {
      console.error(err);
      await this.unloadChat();
    } finally {
      this.requestInProgress = false;
    }
  }

  public async unloadChat() {
    await this.chat.unload();
    this.chatLoaded = false;
  }

  public async resetChat() {
    await this.chat.resetChat();
  }

  public async generate(
    prompt: string,
    progressCallback?: (step: number, currentMessage: string) => void,
  ): Promise<string> {
    try {
      if (this.requestInProgress) {
        throw Error('Request in progress');
      }
      await this.asyncInitChat();
      this.requestInProgress = true;
      const responseMessage = await this.chat.generate(
        prompt,
        progressCallback,
      );
      return responseMessage;
    } catch (err) {
      await this.unloadChat();
      if (err instanceof Error) {
        console.error(err);
        return err.message;
      }
      return 'Error generating chat response';
    } finally {
      this.requestInProgress = false;
    }
  }
}

export const chatManager = (model: ModelName) =>
  new ChatManager(
    new ChatWorkerClient(
      new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
    ),
    model,
  );
