import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import { searchMemory } from '../repositories/memory-repository';
import {
  ChatManager,
  getChatResponse,
  interruptChat,
  resetChat,
  summarize,
} from '../repositories/web-llm-repository';

const CustomScrollbar = styled('div')({
  height: '200px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '10px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
});

const MessageContainer = styled('div')(({ isUser }: { isUser: boolean }) => ({
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  background: isUser ? '#424242' : '#333333',
  color: '#e0e0e0', // Text color
}));

interface ChatBoxProps {
  manager: ChatManager;
  tenantId: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ manager, tenantId }) => {
  const [userMessage, setUserMessage] = useState<string>('');
  const [chatResponses, setChatResponses] = useState<string[]>([]);
  const [inProgressMessage, setInProgressMessage] = useState<string>('');
  const [isGeneratingResponse, setIsGeneratingResponse] =
    useState<boolean>(false);
  const [chatStarted, setChatStarted] = useState<boolean>(false);

  const isMessageEmpty = (): boolean => {
    return userMessage.trim() === '';
  };

  const handleSendMessage = async () => {
    setChatStarted(true);
    setIsGeneratingResponse(true);
    setInProgressMessage('');

    // ユーザーのメッセージを元にタイトルとサブタイトルを取得
    const summaryText = (await summarize(userMessage))[0];

    // summaryTextをqueryとしてメモリから情報を取得
    const memoryResults = await searchMemory(tenantId, summaryText, 5);

    // memoryResultsからsummary情報を取得（ここでは最初の結果だけを使っていますが、必要に応じて調整してください）
    const memoryOriginal = memoryResults[0]?.original || '';

    // memoryOriginalとuserMessageを結合
    const combinedInput = `${userMessage}\n\n${memoryOriginal}`;

    const chatbotResponse = await getChatResponse(
      combinedInput,
      manager,
      (_step, currentMessage) => {
        setInProgressMessage(currentMessage);
      },
    );

    setChatResponses((prev) => [...prev, userMessage, chatbotResponse]);
    setUserMessage('');
    setIsGeneratingResponse(false);
    setInProgressMessage('');
  };

  const handleResetChat = async () => {
    await resetChat(manager);
    setChatResponses([]);
  };

  const handleInterrupt = () => {
    interruptChat(manager);
    setIsGeneratingResponse(false);
    setInProgressMessage('Generation interrupted.');
  };

  return (
    <Card
      style={{
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '95%',
      }}
    >
      <CardContent
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomScrollbar
          style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}
        >
          {!manager.chatLoaded && !chatStarted && (
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ padding: '10px', textAlign: 'center' }}
            >
              Loading model...
            </Typography>
          )}
          {chatResponses.map((message, index) => (
            <MessageContainer key={index} isUser={index % 2 === 0}>
              <Typography variant={index % 2 === 0 ? 'body1' : 'body2'}>
                {message}
              </Typography>
            </MessageContainer>
          ))}
          {inProgressMessage && (
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ padding: '10px' }}
            >
              {inProgressMessage}...
            </Typography>
          )}
        </CustomScrollbar>

        <TextField
          variant="outlined"
          fullWidth
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ marginTop: '10px' }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
          }}
        >
          <Button
            onClick={handleSendMessage}
            color="primary"
            disabled={isGeneratingResponse || isMessageEmpty()}
          >
            Send
          </Button>
          {isGeneratingResponse && (
            <Button onClick={handleInterrupt} color="secondary">
              Interrupt
            </Button>
          )}
          <Button onClick={handleResetChat} color="secondary">
            Reset Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBox;
