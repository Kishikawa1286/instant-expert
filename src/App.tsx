import { useEffect, useState } from 'react';
import {
  ISummary,
  ITenant,
  addMemory,
  addTenant,
  deleteTenant,
  getAllTenants,
  searchMemory,
} from './repositories/memory-repository';

const App = () => {
  const [urls, setUrls] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISummary[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [newTenantName, setNewTenantName] = useState('');
  const [isAccordionOpen, setAccordionOpen] = useState(false);

  const handleDeleteTenant = async (tenantId: number | undefined) => {
    if (!tenantId) {
      return;
    }
    await deleteTenant(tenantId);
    const updatedTenants = await getAllTenants();
    setTenants(updatedTenants);
  };

  const handleSearch = async () => {
    if (selectedTenantId && query) {
      const searchResults = await searchMemory(selectedTenantId, query, 10);
      setResults(searchResults);
    }
  };

  useEffect(() => {
    const fetchTenants = async () => {
      const allTenants = await getAllTenants();
      setTenants(allTenants);
    };
    fetchTenants();
  }, []);

  const handleAddMemory = async () => {
    let currentTenantId = selectedTenantId;

    // If "New Tenant" is selected, create a new tenant and use its ID
    if (selectedTenantId === -1 && newTenantName) {
      currentTenantId = await addTenant(newTenantName);
      const updatedTenants = await getAllTenants();
      setTenants(updatedTenants);
    }

    if (currentTenantId) {
      const urlList = urls.split('\n').filter((url) => url.trim() !== '');
      for (const url of urlList) {
        await addMemory(url, currentTenantId);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-96 rounded-xl bg-gray-800 p-8 shadow-lg">
        <h1 className="mb-4 text-2xl text-white">URL 入力</h1>

        <div className="mb-4">
          <label className="mb-2 block text-white">テナントを選択</label>

          <div
            className="w-full cursor-pointer rounded-md border bg-gray-700 p-2 text-white"
            onClick={() => setAccordionOpen(!isAccordionOpen)}
          >
            {selectedTenantId
              ? tenants.find((t) => t.id === selectedTenantId)?.name
              : 'テナントを選択してください'}
          </div>

          {isAccordionOpen && (
            <div className="max-h-40 w-full overflow-y-auto rounded-md border-y">
              {tenants.map((tenant) => (
                <div
                  className="flex items-center justify-between p-2 hover:bg-gray-700"
                  key={tenant.id}
                >
                  <span
                    onClick={() => setSelectedTenantId(tenant.id ?? null)}
                    className="cursor-pointer"
                  >
                    {tenant.name}
                  </span>
                  <button onClick={() => handleDeleteTenant(tenant.id)}>
                    x
                  </button>
                </div>
              ))}
              <div
                className="p-2 hover:bg-gray-700"
                onClick={() => setSelectedTenantId(-1)}
              >
                新しいテナント
              </div>
            </div>
          )}
        </div>

        {selectedTenantId === -1 && (
          <div className="mb-4">
            <label className="mb-2 block text-white">新しいテナント名</label>
            <input
              type="text"
              placeholder="テナント名"
              value={newTenantName}
              onChange={(e) => setNewTenantName(e.target.value)}
              className="w-full rounded-md border-2 border-gray-700 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 block text-white">URLs</label>
          <textarea
            rows={5}
            placeholder="URLを改行で区切って入力してください"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            className="w-full rounded-md border-2 border-gray-700 p-2 focus:border-blue-500 focus:outline-none"
          ></textarea>
        </div>

        <div className="mb-4 flex">
          <button
            onClick={handleAddMemory}
            className="w-full bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            メモリに追加
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-white">検索クエリ</label>
          <input
            type="text"
            placeholder="検索クエリを入力してください"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border-2 border-gray-700 p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mb-4 flex">
          <button
            onClick={() => handleSearch()}
            className="w-full bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            検索
          </button>
        </div>

        {results.length > 0 && (
          <div>
            <h2 className="mt-4 text-xl text-white">検索結果</h2>
            {results.map((result, index) => (
              <div key={index} className="mt-2 text-white">
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  {result.url}
                </a>
                <p>{result.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
