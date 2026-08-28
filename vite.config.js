import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/config/**/*.js', 'src/domain/**/*.js', 'src/infrastructure/**/*.js', 'src/components/SummaryPage.jsx'],
      exclude: ['src/**/*.test.{js,jsx}'],
      thresholds: { lines: 90, functions: 90, branches: 80, statements: 90 },
    },
  },
})
