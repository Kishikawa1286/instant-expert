import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';
tf.setBackend('webgl');

export class SentenceEncoder {
  private model: use.UniversalSentenceEncoder | null;
  private isProcessing: boolean;

  constructor() {
    this.model = null;
    this.isProcessing = false;
  }

  private async initializeModel() {
    if (!this.model) {
      this.model = await use.load();
    }
  }

  public async encodeSentences(sentences: string[]) {
    if (this.isProcessing) {
      throw new Error('Already processing');
    }
    if (!this.model) {
      await this.initializeModel();
    }
    const model = this.model;
    if (!model) {
      throw new Error('Model not initialized');
    }
    this.isProcessing = true;
    try {
      await this.initializeModel();
      const embeddings = await model.embed(sentences);
      this.isProcessing = false;
      return embeddings.arraySync();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      this.isProcessing = false;
    }
  }
}
