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
    host: true, // Esto permite que el servidor sea accesible en la red local
    port: 5173, // Puedes cambiarlo por el puerto que prefieras
  },
})
