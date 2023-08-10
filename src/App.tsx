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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-white text-2xl mb-4">URL 入力</h1>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="URL を入力してください"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow p-2 rounded-l-md focus:outline-none focus:border-blue-500 border-2 border-gray-700"
          />
          <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600">
            送信
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {markdown && <pre className="text-white overflow-x-scroll">{markdown}</pre>}
      </div>
    </div>
  );
};

export default App;
