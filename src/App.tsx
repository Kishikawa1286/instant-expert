import {
  Box,
  Card,
  CardContent,
  Container,
  LinearProgress,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ChatBox from './components/ChatBox';
import MemoryInput from './components/MemoryInput';
import TenantSelection from './components/TenantSelection';
import {
  ITenant,
  addMemory,
  addTenant,
  deleteTenant,
  getAllTenants,
} from './repositories/memory-repository';
import { createChatManager } from './repositories/web-llm-repository';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  const [urls, setUrls] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);
  const [tenants, setTenants] = useState<ITenant[]>([]);
  const [newTenantName, setNewTenantName] = useState('');
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [completedURLs, setCompletedURLs] = useState<number>(0);
  const [totalURLs, setTotalURLs] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const chatManagerInstance = createChatManager();

  const handleDeleteTenant = async (tenantId: number | null) => {
    if (!tenantId) {
      return;
    }
    await deleteTenant(tenantId);
    const updatedTenants = await getAllTenants();
    setTenants(updatedTenants);
  };

  const handleAddMemory = async () => {
    let currentTenantId = selectedTenantId;

    setIsLoading(true);
    const urlList = urls.split('\n').filter((url) => url.trim() !== '');
    setTotalURLs((prevTotal) => prevTotal + urlList.length);

    if (selectedTenantId === -1 && newTenantName) {
      currentTenantId = await addTenant(newTenantName);
      const updatedTenants = await getAllTenants();
      setTenants(updatedTenants);
    }

    if (currentTenantId) {
      for (const url of urlList) {
        await addMemory(url, currentTenantId);
      }
      setCompletedURLs((prevCompleted) => prevCompleted + urlList.length);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchTenants = async () => {
      const allTenants = await getAllTenants();
      setTenants(allTenants);
    };
    fetchTenants();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Container
        component="main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          maxWidth: 'none',
        }}
      >
        <Card
          style={{
            backgroundColor: '#4a4a4a',
            paddingLeft: '40px',
            paddingRight: '40px',
            width: '80%',
            height: '85%',
            maxWidth: 800,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <CardContent>
            <Typography
              component="h1"
              variant="h4"
              style={{ textAlign: 'center', marginBottom: '10px' }}
            >
              Instant Expert
            </Typography>

            <TenantSelection
              tenants={tenants}
              selectedTenantId={selectedTenantId}
              setSelectedTenantId={setSelectedTenantId}
              newTenantName={newTenantName}
              setNewTenantName={setNewTenantName}
              isAccordionOpen={isAccordionOpen}
              setAccordionOpen={setAccordionOpen}
              handleDeleteTenant={handleDeleteTenant}
              completedURLs={completedURLs}
              totalURLs={totalURLs}
            />

            <Tabs
              value={currentTab}
              onChange={(_event, newValue) => setCurrentTab(newValue)}
              variant="fullWidth"
            >
              <Tab label="Memory" />
              <Tab label="Chat" />
            </Tabs>

            {currentTab === 0 && (
              <>
                {totalURLs > 0 && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    width="100%"
                    marginTop="16px"
                  >
                    <Typography
                      variant="caption"
                      align="center"
                      style={{ margin: '3px 0' }}
                    >
                      {`${completedURLs} / ${totalURLs} Pages Completed`}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(completedURLs / totalURLs) * 100}
                    />
                  </Box>
                )}
                <MemoryInput
                  urls={urls}
                  setUrls={setUrls}
                  handleAddMemory={handleAddMemory}
                  isLoading={isLoading}
                />
              </>
            )}
            {currentTab === 1 && selectedTenantId && (
              <ChatBox
                manager={chatManagerInstance}
                tenantId={selectedTenantId}
              />
            )}
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default App;
