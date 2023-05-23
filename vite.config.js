import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Importa CSS global en todos los archivos
    include: ['./src/**/*.css'],
  },
})
