import { useState } from 'react';
import { ModelName } from './helpers/web-llm/llm-config';
import { fetchMarkdown } from './repositories/html-repository';
import { modelNames, summarize } from './repositories/web-llm-repository';

const App = () => {
  const [url, setUrl] = useState('');
  const [summarizedText, setSummarizedText] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelName | null>(null);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      const result = await fetchMarkdown(url);
      setError(null);

      if (selectedModel) {
        const summary = await summarize(result, { model: selectedModel });
        setSummarizedText(summary);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setSummarizedText([]);
    }
  };

  const handleModelSelect = (model: ModelName) => {
    setSelectedModel(model);
    setAccordionOpen(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-96 rounded-xl bg-gray-800 p-8 shadow-lg">
        <h1 className="mb-4 text-2xl text-white">URL 入力</h1>

        <div className="mb-4">
          <button
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="w-full bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            {selectedModel || 'モデルを選択'}
          </button>
          {accordionOpen && (
            <div className="mt-2 rounded-md border border-gray-700">
              {modelNames.map((model) => (
                <button
                  key={model}
                  onClick={() => handleModelSelect(model)}
                  className="w-full p-2 text-left hover:bg-gray-700"
                >
                  {model}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4 flex">
          <input
            type="text"
            placeholder="URL を入力してください"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="grow rounded-l-md border-2 border-gray-700 p-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            className="rounded-r-md bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            送信
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {summarizedText.length > 0 && (
          <div>
            <h2 className="mt-4 text-xl text-white">Summary</h2>
            {summarizedText.map((summary, index) => (
              <p key={index} className="mt-2 text-white">
                {summary}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
