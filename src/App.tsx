import { useState } from 'react';
import { fetchMarkdown } from './repositories/html-repository';

const App = () => {
  const [url, setUrl] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const result = await fetchMarkdown(url);
      setMarkdown(result);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setMarkdown('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-96 rounded-xl bg-gray-800 p-8 shadow-lg">
        <h1 className="mb-4 text-2xl text-white">URL 入力</h1>
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
        {markdown && (
          <pre className="overflow-x-scroll text-white">{markdown}</pre>
        )}
      </div>
    </div>
  );
};

export default App;
