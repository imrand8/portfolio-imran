import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'src/pages/projects.html'),
        detail: resolve(__dirname, 'src/pages/detail-project.html'),
        contact: resolve(__dirname, 'src/pages/contact.html'),
        about: resolve(__dirname, 'src/pages/about.html')
      }
    }
  }
})