import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: "/",
    resolve: {
      alias: {
        '@modules': '/src/app/modules',
        '@services': '/src/app/services',
        '@app': '/src/app',
        '@metronic': '/src/_metronic',
      },
    },
    server: {
      port: Number(env.PORT) || 5173,
      host: false,        // allows access via localhost and network IP
      strictPort: true,  // fail instead of auto-switching ports
    },
    build: {
      chunkSizeWarningLimit: 3000,
    },
  }
})
