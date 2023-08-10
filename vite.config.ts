import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig((configEnv) => ({
  plugins: [react(), tsConfigPaths(), svgrPlugin()],
  server: {
    host: '0.0.0.0',
  },
}));
