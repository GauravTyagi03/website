import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [solid()],
  base: command === 'serve' ? '/' : '/website/',
}))
