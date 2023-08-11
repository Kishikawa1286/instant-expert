import { Button, TextField } from '@mui/material';

interface MemoryInputProps {
  urls: string;
  setUrls: (urls: string) => void;
  handleAddMemory: () => void;
  isLoading: boolean;
}

const MemoryInput: React.FC<MemoryInputProps> = ({
  urls,
  setUrls,
  handleAddMemory,
  isLoading,
}) => {
  return (
    <div>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="urls"
        label="URLs"
        multiline
        rows={14}
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        placeholder="Enter URLs separated by a newline"
        disabled={isLoading}
      />
      <div style={{ display: 'flex', justifyContent: 'right' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ margin: '4px 0', width: '200px' }}
          onClick={handleAddMemory}
          disabled={isLoading || !urls.trim()}
        >
          Add to Memory
        </Button>
      </div>
    </div>
  );
};

export default MemoryInput;
