import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    strictPort: true,  // Always keeps the port the same. Kill any processes using the port, if the server fails to start.
    port: 8080
  }
})
