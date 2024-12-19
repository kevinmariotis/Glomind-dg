import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Importa CSS global en todos los archivos
    include: ['./src/**/*.css'],
  },
  server: {
    host: '0.0.0.0', // Esto hace que Vite escuche en todas las interfaces de red
    port: 3000, // Puedes cambiar el puerto si lo deseas
  },
})
