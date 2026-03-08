import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Penting untuk library Web3 seperti Wagmi/RainbowKit
    global: 'globalThis', 
  },
})
